import {
  BadRequestException,
  ForbiddenException,
  ParseUUIDPipe,
  UnauthorizedException,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  WsResponse,
  OnGatewayInit,
  WsException,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { ChannelService } from 'src/channel/channel.service';
import { RelationshipController } from 'src/relationship/relationship.controller';
import { UpdateUserStatus, UserStatus } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';
import { HttpExceptionTransformationFilter } from './gateway.filter';
import { GatewayService } from './gateway.service';

@UseFilters(HttpExceptionTransformationFilter)
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly channelService: ChannelService,
    private readonly gatewayService: GatewayService,
  ) {}

  afterInit(srv: Server) {
    this.gatewayService.server = srv;
    srv.use(async (socket, next) => {
      const cookie = socket.handshake.headers.cookie;
      if (!cookie) {
        console.log('Socket verification: no token provided');
        next(new UnauthorizedException('authentication failed'));
      }
      let token = cookie.substring(cookie.indexOf('access_token'));
      const token_end = token.indexOf(';');
      if (token_end != -1) {
        token = token.slice(token.indexOf('=') + 1, token_end);
      } else {
        token = token.slice(token.indexOf('=') + 1);
      }
      const decoded = await this.authService.verify(token);
      if (decoded) {
        if (await this.authService.userExist(decoded['userId'])) {
          console.log('WS auth successful');
          this.users.set(
            socket.id,
            new UpdateUserStatus(decoded.userId, UserStatus.online),
          );
          socket.join(decoded.userId); //Joining a room with named after its own ID
          next();
        } else {
          console.log('Socket verification: unknown user');
          next(new WsException('Unknown user'));
        }
      } else {
        console.log('Socket verification: auth failed');
        next(new WsException('authentication failed'));
      }
    });
  }

  @WebSocketServer() server: Server;
  users = new Map<string, UpdateUserStatus>();

  async handleConnection(client: Socket): Promise<void> {
    // console.log('New user connected: ' + client.id);
    // console.log('All connected users: ', this.users);
    client.emit('all-users-status', Array.from(this.users.values()));
    this.server.emit('status-update', this.users.get(client.id));
  }

  async handleDisconnect(client: Socket): Promise<void> {
    const usr: UpdateUserStatus = this.users.get(client.id);
    usr.status = UserStatus.offline;
    this.server.emit('status-update', usr);
    this.users.delete(client.id);
  }

  /*
  
  *** CHAT MESSAGES (Channels + DM) ***

  Suscribe:
  chat-suscribe-channel --> join room identified by channelID
  chat-suscribe-dm --> join room identified by userID & peerID

  Messages:
  chat-channel-message --> load participant, check if mute/ban, emit if
  chat-DM-message --> emit to both (no checks)

  Unsuscribe:
  chat-quit-channel
  chat-quit-dm

*/

  @SubscribeMessage('chat-join-channel')
  async joinChannel(
    @MessageBody('channelId', ParseUUIDPipe) channelId: string,
    @ConnectedSocket() client: Socket,
  ) {
    if (this.users.has(client.id)) {
      const uid = this.users.get(client.id).id;
      const user = await this.userService.findById(uid);
      const channel = await this.channelService.findOne(channelId);
      try {
        this.channelService.findOneParticipant(user, channel);
        client.join(channelId);
      } catch {
        throw new WsException('User is not part of the channel');
      }
    } else {
      throw new WsException('Unknown user');
    }
  }

  @SubscribeMessage('chat-join-DM')
  async joinDM(
    @MessageBody('peerId', ParseUUIDPipe) peerId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<string> {
    console.log('Join DM request received');
    if (this.users.has(client.id)) {
      const uid = this.users.get(client.id).id;
      const user = await this.userService.findById(uid);
      const peer = await this.userService.findById(peerId);
      const roomName = this.gatewayService.createDMname(user.id, peer.id);
      if (roomName.length === 0) {
        throw new WsException('User and peer have same id');
      } else {
        client.join(roomName);
        return roomName;
      }
    } else {
      throw new WsException('Unknown user');
    }
  }

  // @SubscribeMessage('chat-channel-message')
  // sendChannelMessage(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() msg: string,
  // ): void {
  //   // console.log('Message recieved: ' + data);
  //   this.server.emit('chat-message', msg);
  // }
}
