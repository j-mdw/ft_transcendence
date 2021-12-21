import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BallDto } from "./gameDto/ball.dto";
import { PlayerDto } from "./gameDto/player.dto";
import { GameTypeDto } from "./dto/gameType.dto";
import { setInterval } from 'timers';
import { Logger } from '@nestjs/common';


@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  users: number = 0;


  @SubscribeMessage('chat-message')
  handleEvent(@MessageBody() data: string) {
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


  ///Partie Laurent PongGame


  private logger:Logger = new Logger('GameGateway');
  socketList: Array<Socket> = [];

  ball: BallDto;
  player1: PlayerDto;
  player2: PlayerDto;




  @SubscribeMessage('loop')
  handleGameLoop(client:Socket, message: void): void {
		setInterval(() => {
			this.ball.playerPaddle(this.player1);
			this.ball.playerPaddle(this.player2);
			this.ball.update(this.player1, this.player2);
			this.player1.updatePosition();
			this.player2.updatePosition();
			this.server.emit('returnFullData', { ball: this.ball, p1: this.player1, p2: this.player2 });

		}, 1000/60);

	}

  @SubscribeMessage('initialization')
  handleGameInitEvent(client:Socket, message: void): void {
		this.ball =  new BallDto(640, 480);
		this.player1 = new PlayerDto(40, 70, true);
		this.player2 = new PlayerDto(1240, 1000, true);
		this.server.emit('returnInitialPosition', { ball: this.ball, p1: this.player1, p2: this.player2});
		}

	@SubscribeMessage('keyPress')
	handleGamePaddleMove(client:Socket, data: any): void {
		if (data.inputId === 'up')
			this.player1.pressingUp = data.state;
		else if (data.inputId === 'down')
			this.player1.pressingDown = data.state;
		}


	@SubscribeMessage('keyPress2')
	handleGamePaddleMove2(client:Socket, data: any): void {
		if (data.inputId === 'up')
			this.player2.pressingUp = data.state;
		else if (data.inputId === 'down')
			this.player2.pressingDown = data.state;
		}


	// handleConnection(client: Socket, ...args: any[]) {
	// 	this.logger.log(`Client connected: ${client.id}`);
	// 	this.socketList.push(client.id)
	// }

	// handleDisconnect(client: Socket) {
	// 	this.logger.log(`Client disconnected: ${client.id}`);
	// 	this.socketList.forEach ((element, index) => {
	// 		if (element === client.id)
	// 			this.socketList.splice(index, 1);
	// 	});
	// }

  // afterInit(server: Server) {
	// this.logger.log('Initialized !!!');
  // }


}
