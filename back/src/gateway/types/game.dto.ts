import { IsEnum, IsString } from 'class-validator';
import { GameStyle } from './game';
import { GameKey } from './paddle';
import { Player } from './player';

export class PaddleMoveDTO {
  @IsString()
  gameId: string;

  @IsEnum(GameKey)
  keyChange: GameKey;
}

export class GameStyleDTO {
  // @IsEnum(GameStyle)
  pongType: GameStyle;
}

export class BallDTO {
  x: number;
  y: number;
}

export class GameDTO {
  id: string;
  gameStyle: GameStyle;
  // gameStatus <-- Not implemented yet, check w/ Laurent current implementation
  balls: Array<BallDTO>;
  paddle1Position: number; // confirm w/ Laurent this is the only param we need in the front
  paddle2Position: number;
  scorePlayer1: number;
  scorePlayer2: number;

  constructor(
    id: string,
    gameStyle: GameStyle,
    balls: Array<BallDTO>,
    player1: Player,
    player2: Player,
  ) {
    this.id = id;
    this.gameStyle = gameStyle;
    this.balls = balls;
    this.paddle1Position = player1.paddle.y;
    this.paddle2Position = player2.paddle.y;
    this.scorePlayer1 = player1.score;
    this.scorePlayer2 = player2.score;
  }
}
