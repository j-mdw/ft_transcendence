import { PlayerDto } from "./player.dto";

export class GameTypeDto {

	gameType: string; // multiballs, rookie, classic
	numberOfBalls: number;
	changingPaddle: boolean;

	constructor(gametype: string, balls = 1, changepaddle = false) {
		this.gameType = gametype;
		if (balls)
			this.numberOfBalls = balls;
		if (changepaddle)
			this.changingPaddle = changepaddle;
	}

	updatePlayersPaddleSize(player1: PlayerDto, player2: PlayerDto){
		let diff: number = player1.score - player2.score;
		if (!diff){
			player1.updatePaddleSize(1);
			player2.updatePaddleSize(1);
		}
		else if (diff > 0){
			player1.updatePaddleSize(1);
			player2.updatePaddleSize(1 + diff);
		}
		else if (diff < 0){
			player2.updatePaddleSize(1);
			player1.updatePaddleSize(1 - diff);
		}
	}
}


