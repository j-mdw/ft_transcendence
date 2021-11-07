import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from "@nestjs/websockets";
import { Socket } from "dgram";
import { on } from "events";
import { Server } from "http";

@WebSocketGateway(4001, {
    cors: {
        origin: "http://localhost:3000"
    }
})
export class ChatGateway implements OnGatewayConnection {


    @SubscribeMessage('events')
    handleEvent(@MessageBody() data: string): string {
        console.log('Message recieved: ' + data);
        return data;
    }

    // @WebSocketServer() server: Server;
    // users: number = 0;

    // @W
    async handleConnection() : Promise<void> {
        // this.users++;
        // this.server.emit('users', this.users);
        console.log('New user connected');
    }

    // async handleDisconnect(): Promise<void> {
    //     this.users--;
    //     this.server.emit('users', this.users);
    // }

    // @SubscribeMessage('chat')
    // async onChat(client, message: string): Promise<void> {
    //     client.boreadcast.emit('chat', message);
    // }
}