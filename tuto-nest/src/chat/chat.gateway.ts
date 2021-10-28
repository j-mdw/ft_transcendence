import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server;
    users: number = 0;

    async handleConnection(): Promise<void> {
        this.users++;
        this.server.emit('users', this.users);
    }

    async handleDisconnect(): Promise<void> {
        this.users--;
        this.server.emit('users', this.users);
    }

    @SubscribeMessage('chat')
    async onChat(client, message): Promise<void> {
        client.boreadcast.emit('chat', message);
    }
}