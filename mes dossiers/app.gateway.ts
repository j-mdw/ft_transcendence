/*
https://docs.nestjs.com/websockets/gateways#gateways
*/

import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WsResponse,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { BallDto } from "./dto/ball.dto";
import { PlayerDto } from "./dto/player.dto";
import { GameTypeDto } from "./dto/gameType.dto";

import { setInterval } from 'timers';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  socketList: Array<Socket> = [];
  users: number = 0

  private logger:Logger = new Logger('GameGateway');

  gameType: GameTypeDto = new GameTypeDto('multiballs', 9);
  balls: Array<BallDto> = [];
//   ball: BallDto;
  player1: PlayerDto;
  player2: PlayerDto;


  @WebSocketServer()
  server: Server;


  handleConnection(client: Socket, ...args: any[]) {
	this.logger.log(`Client connected: ${client.id}`);
	}

  handleDisconnect(client: Socket) {
	this.logger.log(`Client disconnected: ${client.id}`);
	this.socketList.forEach ((element, index) => {
		if (element === client.id)
			this.socketList.splice(index, 1);
	});
	}

  afterInit(server: Server) {
	this.logger.log('Initialized !!!');
	}

  @SubscribeMessage('loop')
  handleLoop(client:Socket, message: void): void {
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
			this.server.emit('returnFullData', { balls: this.balls, p1: this.player1, p2: this.player2 });

		}, 1000/60);

	}

  @SubscribeMessage('msgToServer')
  handleMessage(client:Socket, message: {sender: string, message: string}): void {
	  this.server.emit('msgToClient', message);
	}

  @SubscribeMessage('initialization')
  handleInitialization(client:Socket): void {

		this.socketList.push(client);
		this.logger.log(`${this.socketList.length} client connecte`);
		if 

		// while (this.socketList.length  < 2)
		// {
		// 	if (!this.player1){
		// 		this.logger.log('1er client connecte');
		// 		this.player1 = new PlayerDto(40, 70, username);
		// 	}
		// 	this.server.emit('firstPlayerInitialization')
		// }
		// if (this.socketList.length == 2)
		// {
		// 	this.player2 = new PlayerDto(1240, 1000, username);
		// 	for(let i = 0; i < this.gameType.numberOfBalls; i++)
		// 		this.balls[i] = new BallDto(640, 480);
		// 		this.logger.log('2eme client connecte');
		// 	this.server.emit('returnInitialPosition', { balls: this.balls, p1: this.player1, p2: this.player2});
		// }
		// this.logger.log('autre client connecte');



	  	for(let i = 0; i < this.gameType.numberOfBalls; i++)
		  this.balls[i] = new BallDto(640, 480)
		// this.ball =  new BallDto(640, 480);
		this.player1 = new PlayerDto(40, 70, "lolo");
		this.player2 = new PlayerDto(1240, 1000, "coco");
		this.server.emit('returnInitialPosition', { balls: this.balls, p1: this.player1, p2: this.player2});
		}

	@SubscribeMessage('keyPress')
	handlePaddleMove(client:Socket, data: any): void {
		if (data.inputId === 'up')
			this.player1.pressingUp = data.state;
		else if (data.inputId === 'down')
			this.player1.pressingDown = data.state;
		}


	@SubscribeMessage('keyPress2')
	handlePaddleMove2(client:Socket, data: any): void {
		if (data.inputId === 'up')
			this.player2.pressingUp = data.state;
		else if (data.inputId === 'down')
			this.player2.pressingDown = data.state;
		}

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








}
