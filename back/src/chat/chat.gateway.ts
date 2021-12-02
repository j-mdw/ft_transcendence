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
// import { Server } from 'http';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer() server: Server;
  users = 0;

  afterInit() {
    this.server.use((socket, next) => {
      console.log('WS middleware?');
      next();
    });
  }

  @SubscribeMessage('chat-message')
  handleEvent(@MessageBody() data: string): void {
    console.log('Message recieved: ' + data);
    this.server.emit('chat-message', data);
  }

  async handleConnection(): Promise<void> {
    this.users++;
    // this.server.emit('users', this.users);
    console.log('New user connected, user count: ' + this.users);
  }

  async handleDisconnect(): Promise<void> {
    this.users--;
    console.log('User disconnected, user count: ' + this.users);
    // this.server.emit('users', this.users);
  }
}
