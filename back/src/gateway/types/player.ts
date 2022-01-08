import { Socket } from 'socket.io';
import { GameKey, Paddle } from './paddle';

export class Player {
  socket: Socket;
  userId: string;
  pseudo: string;
  paddle: Paddle;
  score: number;
  winner: boolean;
  pressingUp: boolean;
  pressingDown: boolean;

  constructor(socket: Socket, uid: string, pseudo: string) {
    this.socket = socket;
    this.userId = uid;
    this.pseudo = pseudo;
    this.paddle = new Paddle();
    this.score = 0;
    this.winner = false;
    this.pressingUp = false;
    this.pressingDown = false;
  }

  updatePosition() {
    if (this.pressingUp) {
      this.paddle.updatePosition(GameKey.UpPress);
    } else if (this.pressingDown) {
      this.paddle.updatePosition(GameKey.DownPress);
    }
  }

  updatePaddleSize(multipleFactor: number) {
    this.paddle.updatePaddleSize(multipleFactor);
  }
}
