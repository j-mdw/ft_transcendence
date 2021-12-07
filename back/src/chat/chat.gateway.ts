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
import { CLIENT_RENEG_WINDOW } from 'tls';
// import { Server } from 'http';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private authService: AuthService) {}

  afterInit(srv: Server) {
    srv.use(async (socket, next) => {
      const decoded = await this.authService.verify(
        socket.handshake.headers.cookie.slice(13),
      );
      if (decoded) {
        if (await this.authService.userExist(decoded['userId'])) {
          console.log('WS auth successful');
          this.users.set(socket.id, decoded.userId);
          // socket.handshake.auth = { userId: decoded.userId };
          next();
        } else {
          next(new ForbiddenException('Unknown user'));
        }
      } else {
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
  }

  async handleDisconnect(client: Socket): Promise<void> {
    // this.users--;
    this.users.delete(client.id);
    console.log('User disconnected: ' + client.id);
    console.log('All connected users: ', this.users);
    // this.server.emit('users', this.users);
  }
}
