import { PlayerDto } from "./player.dto";

export class GameDataDto {

	gameData: string; // multiballs, rookie, classic
	numberOfBalls: number;
	changingPaddle: boolean;

	constructor(gamedata: string, balls = 1, changepaddle = false) {
		this.gameData = gamedata;
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

	winOrLoose(player1: PlayerDto, player2: PlayerDto): string {
		if (player1.score > player2.score){
			//mettre dans database 1 victoire au credit de player1 et une defaite au credit de player2
			return "1";
		}
		else {
			//mettre dans database 1 victoire au credit de player2 et une defaite au credit de player1
			return "2";
		}
	}
}