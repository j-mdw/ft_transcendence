import { Socket } from 'socket.io';
import { GameStyle } from './game';
import { GameManager } from './gameManager';
import { Player } from './player';

type PlayerQueue = Array<{
  socket: Socket;
  userId: string;
  pseudo: string;
  gameStyle: GameStyle;
  opponentId?: string;
}>;

export class MatchMaker {
  queue: PlayerQueue;
  privateQueue: PlayerQueue;
  manager: GameManager;

  constructor(gameManager: GameManager) {
    this.manager = gameManager;
    this.queue = [];
    this.privateQueue = [];
  }

  join(socket: Socket, userId: string, pseudo: string, gameStyle: GameStyle) {
    const index = this.queue.findIndex(
      (player) => player.gameStyle === gameStyle,
    );
    if (index >= 0) {
      const opponent = this.queue[index];
      if (opponent.userId !== userId) {
        const player1 = new Player(
          opponent.socket,
          opponent.userId,
          opponent.pseudo,
        );
        this.queue.splice(index, 1);
        const player2 = new Player(socket, userId, pseudo);
        this.manager.create(player1, player2, gameStyle, 5);
      }
    } else {
      this.addToQueue(this.queue, socket, userId, pseudo, gameStyle);
    }
  }

  joinPrivate(
    socket: Socket,
    userId: string,
    pseudo: string,
    gameStyle: GameStyle,
    opponentId: string,
  ) {
    const index = this.privateQueue.findIndex(
      (player) => player.userId === opponentId && player.opponentId === userId,
    );
    if (index >= 0) {
      const opponent = this.privateQueue[index];
      const player1 = new Player(
        opponent.socket,
        opponent.userId,
        opponent.pseudo,
      );
      this.privateQueue.splice(index, 1);
      const player2 = new Player(socket, userId, pseudo);
      this.manager.create(player1, player2, gameStyle, 5);
    } else {
      this.addToQueue(
        this.privateQueue,
        socket,
        userId,
        pseudo,
        gameStyle,
        opponentId,
      );
    }
  }

  private addToQueue(
    queue: PlayerQueue,
    socket: Socket,
    userId: string,
    pseudo: string,
    gameStyle: GameStyle,
    opponentId?: string,
  ) {
    let index = this.queue.findIndex((player) => player.userId === userId);
    if (index >= 0) {
      this.queue.splice(index, 1);
    } else {
      index = this.privateQueue.findIndex((player) => player.userId === userId);
      if (index >= 0) {
        this.privateQueue.splice(index, 1);
      }
    }
    queue.push({
      socket: socket,
      userId: userId,
      pseudo: pseudo,
      gameStyle: gameStyle,
      opponentId: opponentId,
    });
  }

  leave(userId: string) {
    let index = this.queue.findIndex((player) => player.userId === userId);
    if (index >= 0) {
      this.queue.splice(index, 1);
    }
    index = this.privateQueue.findIndex((player) => player.userId === userId);
    if (index >= 0) {
      this.privateQueue.splice(index, 1);
    }
  }
}
