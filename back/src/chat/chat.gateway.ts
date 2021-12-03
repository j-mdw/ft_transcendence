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
import { AfterInit } from 'sequelize-typescript';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
// import { Server } from 'http';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(private authService: AuthService) {}

  @WebSocketServer() server: Server;
  users = null;

  afterInit() {
    this.server.use(async (socket, next) => {
      console.log(socket.handshake.headers.cookie['access_token']);
      console.log('Hello from WS middleware');
      const decoded = this.authService.verify(
        socket.handshake.headers.cookie['access_token'],
      );
      if (decoded) {
        if (await this.authService.userExist(decoded['userId'])) {
          console.log('WS auth successful');
          next();
        } else {
          next(new ForbiddenException('Unknown user'));
        }
      }
      next(new ForbiddenException('authentication failed'));
    });
  }

  @SubscribeMessage('chat-message')
  handleEvent(@MessageBody() data: string): void {
    console.log('Message recieved: ' + data);
    this.server.emit('chat-message', data);
  }

  async handleConnection(client: Socket): Promise<void> {
    this.users++;
    // this.server.emit('users', this.users);
    console.log('New user connected: ' + client.id);
  }

  async handleDisconnect(client: Socket): Promise<void> {
    this.users--;
    console.log('User disconnected: ' + client.id);
    // this.server.emit('users', this.users);
  }
}
