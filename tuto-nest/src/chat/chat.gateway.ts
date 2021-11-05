import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "dgram";
import { Server } from "http";

@WebSocketGateway(4001, {
    cors: {
        origin: "http://localhost:3000"
    }
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server: Server;
    users: number = 0;

    async handleConnection(): Promise<void> {
        this.users++;
        this.server.emit('users', this.users);
        console.log('New user');
    }

    async handleDisconnect(): Promise<void> {
        this.users--;
        this.server.emit('users', this.users);
    }

    @SubscribeMessage('chat')
    async onChat(client, message: string): Promise<void> {
        client.boreadcast.emit('chat', message);
    }
}