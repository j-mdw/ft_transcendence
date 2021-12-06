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
import { setInterval } from 'timers';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  socketList: Array<string> = [];
  users: number = 0

  private logger:Logger = new Logger('GameGateway');

  ball: BallDto;
  player1: PlayerDto;
  player2: PlayerDto;

  @WebSocketServer()
  server: Server;


  @SubscribeMessage('loop')
  handleLoop(client:Socket, message: void): void {
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
  handleEvent(client:Socket, message: void): void {
		this.ball =  new BallDto(640, 480);
		this.player1 = new PlayerDto(40, 70, true);
		this.player2 = new PlayerDto(1240, 1000, true);
		this.server.emit('returnInitialPosition', { ball: this.ball, p1: this.player1, p2: this.player2});
		}

	@SubscribeMessage('keyPress')
	handlePaddleMove(client:Socket, data: any): void {
		if (data.inputId === 'up')
			this.player1.pressingUp = data.state;ws
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


	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`Client connected: ${client.id}`);
		this.socketList.push(client.id)
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




}
