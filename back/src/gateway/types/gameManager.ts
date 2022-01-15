import { Inject } from '@nestjs/common';
import { Socket } from 'socket.io';
import { UserService } from 'src/user/user.service';
import { GatewayService } from '../gateway.service';
import { Game, GameStyle } from './game';
import { Player } from './player';

export class GameManager {
  games: Array<Game>;
  roomName: string;
  userService: UserService;

  constructor(
    @Inject()
    private gatewayService: GatewayService,
    @Inject()
    userService: UserService,
  ) {
    this.games = [];
    this.userService = userService;
  }

  create(
    player1: Player,
    player2: Player,
    gameStyle: GameStyle = GameStyle.classic,
    winScore = 5,
  ) {
    const game = new Game(
      player1,
      player2,
      this,
      this.gatewayService,
      gameStyle,
      winScore,
    );
    this.games.push(game);
    game.start();
  }

  isPlaying(userId: string): boolean {
    const game = this.getPlayerGame(userId);
    if (game) {
      return true;
    } else {
      return false;
    }
  }

  reJoin(userId: string, socket: Socket) {
    const game = this.getPlayerGame(userId);
    if (game) {
      let player: Player;
      if (game.player1.userId === userId) {
        player = game.player1;
      } else {
        player = game.player2;
      }
      player.socket = socket;
      socket.join(game.roomId);
    }
  }

  removeGame(id: string) {
    const index = this.games.findIndex((game) => game.roomId === id);
    if (index >= 0) {
      this.games.splice(index, 1);
    }
  }

  getGame(id: string): Game | undefined {
    return this.games.find((game) => game.roomId === id);
  }

  private getPlayerGame(userId: string): Game | undefined {
    return this.games.find((game) => {
      if (game.player1.userId === userId || game.player2.userId === userId) {
        return true;
      }
      return false;
    });
  }

  getLiveGame(gameStyle?: GameStyle): Game | undefined {
    if (gameStyle) {
      return this.games.find((game) => game.type === gameStyle);
    } else {
      if (this.games.length > 0) {
        return this.games[0];
      } else {
        return undefined;
      }
    }
  }

  getAllGames(): Game[] {
    return this.games;
  }

  leaveGame(userId: string) {
    const game = this.getPlayerGame(userId);
    game.playerLeaving(userId);
  }
}
