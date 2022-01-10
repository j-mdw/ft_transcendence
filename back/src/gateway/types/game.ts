import { Inject } from '@nestjs/common';
import { clearInterval } from 'timers';
import { GatewayService } from '../gateway.service';
import { Ball } from './ball';
import { BallDTO, GameDTO } from './game.dto';
import { GameManager } from './gameManager';
import { GameKey } from './paddle';
import { Player } from './player';

export enum GameStyle {
  classic,
  multiballs,
  rookie,
}

export enum GameState {
  beforeStart,
  playing,
  over,
}

export class Game {
  // gameData: string; // multiballs, rookie, classic
  // numberOfBalls: number;
  // changingPaddle: boolean;
  roomId: string;
  type: GameStyle;
  balls: Array<Ball>;
  player1: Player;
  player2: Player;
  manager: GameManager;
  winScore: number;
  intervalId: NodeJS.Timer;
  state: GameState;
  startTime: Date;
  countdown: number;

  constructor(
    player1: Player,
    player2: Player,
    manager: GameManager,
    @Inject()
    private gatewayService: GatewayService,
    style: GameStyle = GameStyle.classic,
    winScore = 5,
    countdown = 5,
  ) {
    this.roomId = this.createRoomId(player1.userId, player2.userId);
    this.player1 = player1;
    this.player2 = player2;
    // this.player1.paddle.init(40);
    // this.player2.paddle.init(1240);
    this.manager = manager;
    this.type = style;
    this.balls = [];
    // this.initBalls(style);
    this.winScore = winScore;
    this.state = GameState.beforeStart;
    this.countdown = countdown;
  }

  start() {
    this.player1.socket.join(this.roomId);
    this.player2.socket.join(this.roomId);
    this.startTime = new Date();
    this.intervalId = setInterval(() => {
      this.tick();
    }, 1000 / 30);
    // }, 1000 / 30);
  }

  private createRoomId(user1: string, user2: string): string {
    return `game:${user1}:${user2}`;
  }

  private async tick() {
    switch (this.state) {
      case GameState.beforeStart:
        const secondsElapsed = this.getSecondsElapsed();
        if (secondsElapsed > this.countdown) {
		  this.state = GameState.playing;
		  this.player1.paddle.init(40);
		  this.player2.paddle.init(1240);
		  this.initBalls(this.type);
          break;
        }
      case GameState.playing:
        this.player1.updatePosition();
        this.player2.updatePosition();
        this.balls.forEach((ball) => ball.update(this.player1, this.player2));
        const winner = this.isGameOver();
        if (winner != 0) {
          console.log('Player', winner, 'won!'); //TBU

          this.state = GameState.over;
        } else {
          if (this.type == GameStyle.rookie) {
            this.updatePaddleSize();
          }
          this.emitUpdate();
        }
        break;
      case GameState.over:
        this.emitUpdate();
        clearInterval(this.intervalId);
        this.emptyRoom();
        await this.saveResult();
        this.manager.removeGame(this.roomId);
        break;
    }
  }

  private getSecondsElapsed(): number {
    return (new Date().getTime() - this.startTime.getTime()) / 1000;
  }

  private async saveResult() {
    await this.manager.userService.gameOver(
      this.player1.userId,
      this.player2.userId,
      this.player1.score,
      this.player2.score,
    );
  }

  private emitUpdate() {
    const gameData = new GameDTO(
      this.roomId,
      this.type,
      this.state,
      this.balls.map((ball) => new BallDTO(ball)),
      this.player1,
      this.player2,
      this.countdown - Math.floor(this.getSecondsElapsed()),
    );
    this.gatewayService.server
      .to(this.roomId)
      .emit('game-data-update', gameData);
  }

  private updatePaddleSize() {
    const diff: number = this.player1.score - this.player2.score;
    if (diff == 0) {
      this.player1.updatePaddleSize(1);
      this.player2.updatePaddleSize(1);
    }
    if (diff > 0) {
      this.player2.updatePaddleSize(1 + diff);
    } else if (diff < 0) {
      this.player1.updatePaddleSize(1 - diff);
    }
  }

  private isGameOver(): number {
    if (this.player1.score >= this.winScore) {
      return 1;
    } else if (this.player2.score >= this.winScore) {
      return 2;
    }
    return 0;
  }

  private initBalls(style: GameStyle): void {
    this.balls.push(new Ball());
    if (style === GameStyle.multiballs) {
      for (let i = 0; i < 8; i++) {
        this.balls.push(new Ball());
      }
    }
  }

  playerAction(userId: string, keyChange: GameKey) {
    const player = this.getPlayerById(userId);
    if (player) {
      switch (keyChange) {
        case GameKey.UpPress:
          player.pressingUp = true;
          break;
        case GameKey.UpRelease:
          player.pressingUp = false;
          break;
        case GameKey.DownPress:
          player.pressingDown = true;
          break;
        case GameKey.DownRelease:
          player.pressingDown = false;
          break;
      }
    }
  }

  getPlayerById(userId: string): Player | undefined {
    if (this.player1.userId === userId) {
      return this.player1;
    } else if (this.player2.userId === userId) {
      return this.player2;
    } else {
      return undefined;
    }
  }

  playerLeaving(userId: string): void {
    if (this.player1.userId === userId) {
      this.player1.score = 0;
      this.player2.score = this.winScore;
    } else if (this.player2.userId === userId) {
      this.player1.score = this.winScore;
      this.player2.score = 0;
    }
  }

  private emptyRoom(): void {
    this.player1.socket.leave(this.roomId);
    this.player2.socket.leave(this.roomId);
  }
}
