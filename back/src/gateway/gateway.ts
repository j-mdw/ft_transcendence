import { ForbiddenException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  WsResponse,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
// import { Server } from 'http';

enum UserStatus {
  online,
  offline,
  playing,
}

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private authService: AuthService) {}

  afterInit(srv: Server) {
    srv.use(async (socket, next) => {
      const cookie = socket.handshake.headers.cookie;
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
          this.users.set(socket.id, {
            id: decoded.userId,
            status: UserStatus.online,
          });
          // socket.handshake.auth = { userId: decoded.userId };
          next();
        } else {
          console.log('Socker verification: unknown user');
          next(new ForbiddenException('Unknown user'));
        }
      } else {
        console.log('Socker verification: auth failed');
        next(new ForbiddenException('authentication failed'));
      }
    });
  }

  @WebSocketServer() server: Server;
  users = new Map();

  @SubscribeMessage('chat-message')
  handleEvent(@MessageBody() data: string): void {
    console.log('Message recieved: ' + data);
    this.server.emit('chat-message', data);
  }

  async handleConnection(client: Socket): Promise<void> {
    // this.users++;
    // this.server.emit('users', this.users);
    console.log('New user connected: ' + client.id);
    console.log('All connected users: ', this.users);
    client.emit('all-users-status', Array.from(this.users.values()));
  }

  async handleDisconnect(client: Socket): Promise<void> {
    // this.users--;
    this.users.delete(client.id);
    console.log('User disconnected: ' + client.id);
    console.log('All connected users: ', this.users);
    // this.server.emit('users', this.users);
  }
}
