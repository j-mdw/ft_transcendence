import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Ball } from './ball';
import { GameState, GameStyle } from './game';
import { GameKey, Paddle } from './paddle';
import { Player } from './player';

export class PaddleMoveDTO {
  @IsString()
  gameId: string;

  @IsEnum(GameKey)
  keyChange: GameKey;
}

export class GameStyleDTO {
  @IsEnum(GameStyle)
  pongType: GameStyle;
}

export class GameIdDTO {
  @IsOptional()
  @IsString()
  id: string;
}

export class BallDTO {
  x: number;
  y: number;
  radius: number;

  constructor(ball: Ball) {
    this.x = ball.x;
    this.y = ball.y;
    this.radius = ball.radius;
  }
}

export class PaddleDTO {
  x: number;
  y: number;
  w: number;
  h: number;

  constructor(paddle: Paddle) {
    this.x = paddle.x;
    this.y = paddle.y;
    this.w = paddle.w;
    this.h = paddle.h;
  }
}

export class PlayerDTO {
  id: string;
  score: number;
  paddle: PaddleDTO;

  constructor(player: Player) {
    this.id = player.userId;
    this.score = player.score;
    this.paddle = new PaddleDTO(player.paddle);
  }
}

export class GameDTO {
  id: string;
  style: GameStyle;
  state: GameState;
  balls: Array<BallDTO>;
  player1: PlayerDTO;
  player2: PlayerDTO;
  countdown: number;

  constructor(
    id: string,
    gameStyle: GameStyle,
    gameState: GameState,
    balls: Array<BallDTO>,
    player1: Player,
    player2: Player,
    countdown: number,
  ) {
    this.id = id;
    this.state = gameState;
    this.style = gameStyle;
    this.balls = balls;
    this.player1 = new PlayerDTO(player1);
    this.player2 = new PlayerDTO(player2);
    this.countdown = countdown;
  }
}
