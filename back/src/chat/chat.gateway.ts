import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from "@nestjs/websockets";
import { Socket } from "dgram";
import { Server } from "http";

@WebSocketGateway({
    cors: {
        origin: "http://localhost:3000"
    }
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server: Server;
    users: number = 0;

    @SubscribeMessage('chat-message')
    handleEvent(@MessageBody() data: string) {
        console.log('Message recieved: ' + data);
        // return data;
        this.server.emit('chat-message', data);
    }

    // @SubscribeMessage('chat-message')
    // handleEvent(@MessageBody() data: string) {
    //     console.log('Message recieved: ' + data);
    //     // return data;
    //     this.server.emit('chat-message', data);
    // }

    async handleConnection() : Promise<void> {
        this.users++;
        // this.server.emit('users', this.users);
        console.log('New user connected, user count: ' + this.users);
    }

    async handleDisconnect(): Promise<void> {
        this.users--;
        console.log('User disconnected, user count: ' + this.users);
        // this.server.emit('users', this.users);
    }

    // @SubscribeMessage('chat')
    // async onChat(client, message: string): Promise<void> {
    //     client.boreadcast.emit('chat', message);
    // }
}