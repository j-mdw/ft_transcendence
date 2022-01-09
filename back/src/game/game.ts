import { PlayerDto } from "./../gateway/gameDto/player.dto";
import { Socket, Server } from 'socket.io';
import { BallDto } from "./../gateway/gameDto/ball.dto";
import { GameDataDto } from "./../gateway/gameDto/gamedata.dto";
import { setInterval, clearInterval } from 'timers';

export class Game{

	player1Socket: Socket;
	player2Socket: Socket;
	player1UserName: string;
	player2UserName: string;
	roomName: string;
	gameData: GameDataDto;
	player1: PlayerDto;
	player2: PlayerDto;
	balls: Array <BallDto> = [];
	intervalId: NodeJS.Timer;
	playing: boolean;

	constructor(player1: Socket, player2: Socket, player1Name: string, player2Name: string, room: string) {
		this.player1Socket = player1;
		this.player2Socket = player2;
		this.player1UserName = player1Name;
		this.player2UserName = player2Name;
		this.roomName = room;
		this.gameData = new GameDataDto(room);
		this.player1 = new PlayerDto(40, 70, player1Name);
		this.player2 = new PlayerDto(1240, 1000, player2Name);
		for(let i = 0; i < this.gameData.numberOfBalls; i++)
			this.balls[i] = new BallDto(640, 480);
		this.playing = false;

	}

	gameCleanDelete() {
		delete this.gameData;
		delete this.player1;
		delete this.player2;
		for (let i in this.balls)
			delete this.balls[i];
		// while (this.balls.length)
		// 	this.balls.pop();
		delete this.balls;
		if (this.intervalId)
			clearInterval(this.intervalId);


			//attention voir si on delete les 2 sockets de la socketlist ici( a priori non car il faut prevenir les 2 suivants de la liste)
	}

}