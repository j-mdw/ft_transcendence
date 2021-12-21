import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { 
  Server, 
  Socket,
 } from 'socket.io';
import { BallDto } from "./gameDto/ball.dto";
import { PlayerDto } from "./gameDto/player.dto";
import { GameTypeDto } from "./gameDto/gametype.dto";
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

  private logger:Logger = new Logger('GameGateway');


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

  async handleDisconnect(client: Socket): Promise<void> {
    this.users--;
    console.log('User disconnected, user count: ' + this.users);
    // this.server.emit('users', this.users);
	// partie pour laurent
	this.logger.log(`Client disconnected of game: ${client.id}`);
	this.socketList.forEach ((element, index) => {
		if (element === client)
		{
			this.socketList.splice(index, 1);
			this.logger.log(`${this.socketList.length} client connecte suite a deconnection`);
		}
	});
  }


  ///Partie Laurent PongGame

  socketList: Array<Socket> = [];

  gameType: GameTypeDto = new GameTypeDto('classic');

  balls: Array<BallDto> = [];

  player1: PlayerDto;
  player2: PlayerDto;




  @SubscribeMessage('loop')
  handleGameLoop(client:Socket, message: void): void {
	setInterval(() => {
		for (let i in this.balls){
			let ball = this.balls[i];
			ball.playerPaddle(this.player1);
			ball.playerPaddle(this.player2);
			ball.update(this.player1, this.player2, this.gameType);
		}
		if (this.gameType && this.gameType.changingPaddle)
			this.gameType.updatePlayersPaddleSize(this.player1, this.player2);
		this.player1.updatePosition();
		this.player2.updatePosition();
		for (let i in this.socketList) {
			let socket = this.socketList[i];
			socket.emit('returnFullData', { balls: this.balls, p1: this.player1, p2: this.player2 });
		}
		////probablement a faire avec les rooms
	}, 1000/60);

	}

  @SubscribeMessage('initialization')
  handleGameInitEvent(client:Socket, username: string): void {
	this.socketList.push(client);
	this.logger.log(`${this.socketList.length} client connecte`);
	if (this.socketList.length === 1) {
		this.player1 = new PlayerDto(40, 70, username);
		this.logger.log(`1er client connecte, ${this.player1.userName}`);
		this.player2 = this.player2 = new PlayerDto(1240, 1000, "entrainement");
	}
	if (this.socketList.length === 2) {
		this.player1.y = 480;
		this.player1.score = 0;
		this.player2.y = 480;
		this.player2.score = 0;   // on peut aussi delete le player 2 et le recreer
		this.player2.userName = username;
		this.logger.log(`2eme client connecte, ${this.player2.userName}`);
		for(let i = 0; i < this.gameType.numberOfBalls; i++)
			delete this.balls[i];
	}
	if (this.socketList.length > 2){
		for (let i in this.socketList) {
			let socket = this.socketList[i];
			socket.emit('returnFullData', { balls: this.balls, p1: this.player1, p2: this.player2 });
		}
	}
	else{
		for(let i = 0; i < this.gameType.numberOfBalls; i++)
		this.balls[i] = new BallDto(640, 480);
		for (let i in this.socketList) {
			let socket = this.socketList[i];
			socket.emit('returnFullData', { balls: this.balls, p1: this.player1, p2: this.player2 });
		}
	}
  }

  @SubscribeMessage('keyPress')
  handleGamePaddleMove(client:Socket, data: any): void {
	if (client === this.socketList[0]){
		if (data.inputId === 'up')
			this.player1.pressingUp = data.state;
		else if (data.inputId === 'down')
			this.player1.pressingDown = data.state;
		}
	}


  @SubscribeMessage('keyPress2')
  handleGamePaddleMove2(client:Socket, data: any): void {
	if (client === this.socketList[1]) {
		if (data.inputId === 'up')
			this.player2.pressingUp = data.state;
		else if (data.inputId === 'down')
			this.player2.pressingDown = data.state;
		}
	}

	//servira pour integrer le type de jeu
  @SubscribeMessage('typeofgame')
  handleGameType(client:Socket, data: string): void {
	this.logger.log(`type of game renseigne`);

	if (data === 'multiballs')
		this.gameType = new GameTypeDto('multiballs', 9);
	else if (data === 'rookie')
		this.gameType = new GameTypeDto('rookie', 1, true);
	else
		this.gameType = new GameTypeDto('classic');
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
