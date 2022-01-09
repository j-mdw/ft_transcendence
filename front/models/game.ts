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

export enum GameKey {
  UpPress,
  UpRelease,
  DownPress,
  DownRelease,
}

export enum Role {
  spectator,
  player1,
  player2,
}

export interface PaddleMoveDTO {
  gameId: string;
  keyChange: GameKey;
}

export interface GameStyleDTO {
  pongType: GameStyle;
}

export interface GameIdDTO {
  id: string;
}

export interface Ball {
  x: number;
  y: number;
  radius: number;
}

export interface Paddle {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Player {
  paddle: Paddle;
  id: string;
  score: number;
}

export interface GameDTO {
  id: string;
  style: GameStyle;
  state: GameState;
  balls: Array<Ball>;
  player1: Player;
  player2: Player;
}
