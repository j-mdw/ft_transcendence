import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  ParseUUIDPipe,
  UnauthorizedException,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { Channel } from 'src/channel/channel.entity';
import { ChannelService } from 'src/channel/channel.service';
import { ChannelParticipant } from 'src/channelParticipant/channelParticipant.entity';
import { UpdateUserStatus, UserStatus } from 'src/user/user.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { MessageToClientDTO, MessageToServerDTO } from './types/channel.dto';
import { HttpExceptionTransformationFilter } from './gateway.filter';
import { GatewayService } from './gateway.service';
import { GameManager } from './types/gameManager';
import { MatchMaker } from './types/matchMaker';
import { GameIdDTO, PaddleMoveDTO } from './types/game.dto';
import { IsEnum } from 'class-validator';
import { GameStyle } from './types/game';

export class GameStyleDTO {
  @IsEnum(GameStyle)
  pongType: GameStyle;
}

@UseFilters(HttpExceptionTransformationFilter)
@UsePipes(new ValidationPipe())
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
        if (await this.authService.userHasAccess(decoded['userId'])) {
          console.log('WS auth successful');
          this.users.set(
            socket.id,
            new UpdateUserStatus(decoded.userId, UserStatus.online),
          );
          socket.join(decoded.userId); //Joining a room with named after its own ID
          next();
        } else {
          console.log('Socket verification: unknown user');
          next(new UnauthorizedException('unknown user'));
        }
      } else {
        console.log('Socket verification: auth failed');
        next(new UnauthorizedException('auth failed'));
      }
    });
  }

  @WebSocketServer() server: Server;
  users = new Map<string, UpdateUserStatus>();

  async handleConnection(client: Socket): Promise<void> {
    client.emit('all-users-status', Array.from(this.users.values()));
    const user = this.users.get(client.id);
    if (user && this.gameManager.isPlaying(user.id)) {
      this.gameManager.reJoin(user.id, client);
      user.status = UserStatus.playing;
    }
    this.server.emit('status-update', this.users.get(client.id));
  }

  async handleDisconnect(client: Socket): Promise<void> {
    const usr: UpdateUserStatus = this.users.get(client.id);
    usr.status = UserStatus.offline;
    this.server.emit('status-update', usr);
    this.users.delete(client.id);
  }

  /* PONG GAME */

  gameManager = new GameManager(this.gatewayService, this.userService);
  matchMaker = new MatchMaker(this.gameManager);

  @SubscribeMessage('game-play')
  async addPlayer(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameStyle: GameStyleDTO,
  ): Promise<void> {
    // console.log('Queue before join:', this.matchMaker.queue);
    const user = this.users.get(client.id);
    if (user) {
      const userEntity = await this.userService.findById(user.id);
      if (!this.gameManager.isPlaying(user.id)) {
        this.matchMaker.join(
          client,
          userEntity.id,
          userEntity.pseudo,
          gameStyle.pongType,
        );
        user.status = UserStatus.playing;
        this.server.emit('status-update', this.users.get(client.id));
        // console.log('Queue after join:', this.matchMaker.queue);
      }
    }
  }

  @SubscribeMessage('game-play-private')
  async addPrivatePlayer(
    @ConnectedSocket() client: Socket,
    @MessageBody() opponentId: string,
  ): Promise<void> {
    // console.log('Queue before join:', this.matchMaker.privateQueue);
    const user = this.users.get(client.id);
    if (user.id === opponentId) {
      throw new BadRequestException('wrong opponent id');
    }
    if (user) {
      const userEntity = await this.userService.findById(user.id);
      try {
        await this.userService.findById(opponentId);
      } catch {
        throw new BadRequestException('wrong opponent id');
      }
      if (!this.gameManager.isPlaying(user.id)) {
        this.matchMaker.joinPrivate(
          client,
          userEntity.id,
          userEntity.pseudo,
          GameStyle.classic,
          opponentId,
        );
        user.status = UserStatus.playing;
        this.server.emit('status-update', this.users.get(client.id));
        // console.log('Queue after join:', this.matchMaker.privateQueue);
      }
    }
  }

  @SubscribeMessage('game-watch')
  addSpectator(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameStyle: GameStyleDTO,
  ): boolean {
    const game = this.gameManager.getLiveGame(gameStyle.pongType);
    if (game) {
      client.join(game.roomId);
      return true;
    } else {
      return false;
    }
  }

  @SubscribeMessage('game-leave')
  removePlayer(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameId?: GameIdDTO,
  ): void {
    // console.log('Queue before leave:', this.matchMaker.queue);
    // console.log('Private Queue before leave:', this.matchMaker.privateQueue);
    const user = this.users.get(client.id);
    if (user) {
      this.matchMaker.leave(user.id);
      if (this.gameManager.isPlaying(user.id)) {
        this.gameManager.leaveGame(user.id);
      }
      if (gameId) {
        client.leave(gameId.id); // Useful for spectators leaving games
      }
      user.status = UserStatus.online;
      this.server.emit('status-update', this.users.get(client.id));
      // console.log('Queue after leave:', this.matchMaker.queue);
      // console.log('Private Queue after leave:', this.matchMaker.privateQueue);
    }
  }

  @SubscribeMessage('game-update-from-player')
  updatePlayer(
    @ConnectedSocket() client: Socket,
    @MessageBody() paddleMove: PaddleMoveDTO,
  ): void {
    const user = this.users.get(client.id);
    if (user) {
      const game = this.gameManager.getGame(paddleMove.gameId);
      if (game) {
        game.playerAction(user.id, paddleMove.keyChange);
      }
    }
  }
  /*
  
  *** CHAT MESSAGES (Channels + DM) ***

  Join:
  -> chat-join-channel (join room identified by channelID)
  <- chat-channel-joined (receive channel ID)
  -> chat-join-DM (join room identified by userID & peerID)
  <- chat-DM-joinned (receive channel ID)

  Messages:
  -> chat-channel-message (MessageToServerDTO)
  <- chat-message-to-client (MessageToClientDTO)
  chat-channel-message --> load participant, check if mute/ban, emit if
  chat-DM-message --> emit to both (no checks)

  Leave:
  -> chat-leave (channelId)

*/

  @SubscribeMessage('chat-join-channel')
  async joinChannel(
    // @MessageBody('channelId', ParseUUIDPipe) channelId: string,
    @MessageBody() channelId: string,
    @ConnectedSocket() client: Socket,
  ) {
    if (this.users.has(client.id)) {
      const uid = this.users.get(client.id).id;
      let user: User;
      let channel: Channel;
      try {
        user = await this.userService.findById(uid);
        channel = await this.channelService.findOne(channelId.toString());
      } catch {
        throw new NotFoundException();
      }
      try {
        const participant = await this.channelService.findOneParticipant(
          user,
          channel,
        );
        if (!participant.banned) {
          client.join(channel.id);
          client.emit('chat-channel-joined', channel.id);
        }
      } catch {
        throw new ForbiddenException('User is not part of the channel');
      }
    } else {
      throw new UnauthorizedException('Unknown user');
    }
  }

  @SubscribeMessage('chat-join-DM')
  async joinDM(
    // @MessageBody('peerId', ParseUUIDPipe) peerId: string,
    @MessageBody() peerId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    if (this.users.has(client.id)) {
      const uid = this.users.get(client.id).id;
      let user: User;
      let peer: User;
      try {
        user = await this.userService.findById(uid);
        peer = await this.userService.findById(peerId);
      } catch {
        throw new NotFoundException();
      }
      const chanName = this.gatewayService.createDMname(user.id, peer.id);
      if (chanName.length === 0) {
        throw new BadRequestException('User and peer have same id');
      } else {
        let channel: Channel;
        try {
          channel = await this.channelService.findOneDMchannel(chanName);
        } catch {
          channel = await this.channelService.createDMchannel(
            user,
            peer,
            chanName,
          );
        }
        client.join(channel.id);
        client.emit('chat-DM-joined', channel.id);
      }
    } else {
      throw new UnauthorizedException('Unknown user');
    }
  }

  @SubscribeMessage('chat-channel-message')
  async sendChannelMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() msg: MessageToServerDTO,
  ): Promise<void> {
    if (this.users.has(client.id)) {
      const uid = this.users.get(client.id).id;
      let user: User;
      let chan: Channel;
      try {
        user = await this.userService.findById(uid);
        chan = await this.channelService.findOne(msg.channelId);
      } catch {
        throw new NotFoundException();
      }
      let participant: ChannelParticipant;
      try {
        participant = await this.channelService.findOneParticipant(user, chan);
      } catch {
        throw new ForbiddenException('User is not a channel member');
      }
      if (participant.banned) {
        client.leave(chan.id);
        return;
      }
      if (participant.muted) {
        if (participant.muteEnd < new Date()) {
          await this.channelService.removeMute(participant);
        } else {
          return;
        }
      }
      this.server
        .to(msg.channelId)
        .emit(
          'chat-message-to-client',
          new MessageToClientDTO(user, chan.id, msg.message),
        );
      await this.channelService.addMessage(uid, chan.id, msg.message);
    }
  }

  @SubscribeMessage('chat-DM-message')
  async sendDM(
    @ConnectedSocket() client: Socket,
    @MessageBody() msg: MessageToServerDTO,
  ): Promise<void> {
    if (this.users.has(client.id)) {
      const uid = this.users.get(client.id).id;
      let user: User;
      let chan: Channel;
      try {
        user = await this.userService.findById(uid);
        chan = await this.channelService.findOne(msg.channelId);
      } catch {
        throw new NotFoundException();
      }
      try {
        await this.channelService.findOneParticipant(user, chan);
      } catch {
        throw new ForbiddenException('User is not a member');
      }
      let invite: boolean;
      if (msg.gameInvite) {
        invite = msg.gameInvite;
      } else {
        invite = false;
      }
      this.server
        .to(msg.channelId)
        .emit(
          'chat-message-to-client',
          new MessageToClientDTO(user, chan.id, msg.message, invite),
        );
      await this.channelService.addMessage(uid, chan.id, msg.message, invite);
    }
  }

  @SubscribeMessage('chat-leave')
  async leaveChannel(
    // @MessageBody('channelId', ParseUUIDPipe) channelId: string,
    @MessageBody() channelId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const uid = this.users.get(client.id).id;
    let user: User;
    let chan: Channel;
    try {
      user = await this.userService.findById(uid);
      chan = await this.channelService.findOne(channelId);
    } catch {
      throw new NotFoundException();
    }
    try {
      await this.channelService.findOneParticipant(user, chan);
    } catch {
      throw new ForbiddenException('User is not a member');
    }
    client.leave(channelId);
  }
}

/*
    TESTING - CHAT

  - Join channel:
    - Channel does not exist -> 404
    - channel member try to join -> receive chat-channel-joined message w/ chan ID
    - non-member try to join -> 403
  - Join DM:
    - Peer exists:
      - 1st time -> creates channel, receive chat-DM-joined message w/ chan ID
      - Another time -> receive chat-DM-joined message w/ chan ID
    - Peer does not exist:
      - 404
  - Channel Message:
    - Empty message -> 400
    - Unknown channel -> 404
    - User not a participant -> 403
    - User is banned -> Do nothing
    - User is muted (not expired) -> Do nothing
    - User is muted (expired) -> set muted to false, send and save message
    - Normal -> save msg, Receive MessageToClientDTO
  
  - DM Message:
    - channel does not exist -> 404
    - User is not a participant -> 403
    - Empty message -> 400
    - Normal -> save msg, Receive MessageToClientDTO

  - Message test:
    - Deleted on channel delete
    - Deleted on user delete
*/
