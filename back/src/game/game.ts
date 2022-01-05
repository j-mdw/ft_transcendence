import { PlayerDto } from "./../gateway/gameDto/player.dto";
import { Socket, Server } from 'socket.io';
import { BallDto } from "./../gateway/gameDto/ball.dto";
import { GameDataDto } from "./../gateway/gameDto/gamedata.dto";
import { setInterval, clearInterval } from 'timers';

export class Game{

	player1Socket: Socket;
	player2Socket: Socket;
	roomName: string;
	gamedata: GameDataDto;
	player1: PlayerDto;
	player2: PlayerDto;
	balls: Array <BallDto>;
	intervalId: NodeJS.Timer;

	constructor(player1: Socket, player2: Socket, room: string) {
		

	}

}