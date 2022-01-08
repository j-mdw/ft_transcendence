import { Socket } from 'socket.io';
import { GameStyle } from './game';
import { GameManager } from './gameManager';
import { Player } from './player';

export class MatchMaker {
  queue: Array<{
    socket: Socket;
    userId: string;
    pseudo: string;
    gameStyle: GameStyle;
  }>;
  manager: GameManager;

  constructor(gameManager: GameManager) {
    this.manager = gameManager;
    this.queue = [];
  }

  join(socket: Socket, userId: string, pseudo: string, gameStyle: GameStyle) {
    const index = this.queue.findIndex(
      (player) => player.gameStyle === gameStyle,
    );
    if (index >= 0) {
      const oponent = this.queue[index];
      if (oponent.userId !== userId) {
        const player1 = new Player(
          oponent.socket,
          oponent.userId,
          oponent.pseudo,
        );
        this.queue.splice(index, 1);
        const player2 = new Player(socket, userId, pseudo);
        this.manager.create(player1, player2, gameStyle, 1);
      }
    } else {
      this.addToQueue(socket, userId, pseudo, gameStyle);
    }
  }

  private addToQueue(
    socket: Socket,
    userId: string,
    pseudo: string,
    gameStyle: GameStyle,
  ) {
    const index = this.queue.findIndex((player) => player.userId === userId);
    if (index >= 0) {
      this.queue.splice(index, 1);
    }
    this.queue.push({
      socket: socket,
      userId: userId,
      pseudo: pseudo,
      gameStyle: gameStyle,
    });
  }

  leave(userId: string) {
    const index = this.queue.findIndex((player) => player.userId === userId);
    if (index >= 0) {
      this.queue.splice(index, 1);
    }
  }
}
