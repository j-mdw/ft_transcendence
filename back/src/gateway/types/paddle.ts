export enum GameKey {
  UpPress,
  UpRelease,
  DownPress,
  DownRelease,
}

export class Paddle {
  x: number; // max 1280
  y: number; // max 960
  w: number;
  h: number;
  hInitial: number;

  constructor(x = 40) {
    this.init(x);
  }

  updatePosition(keyPressed: GameKey) {
    if (keyPressed === GameKey.UpPress) this.y -= 30;
    if (keyPressed === GameKey.DownPress) this.y += 30;
    if (this.y < this.h / 2) this.y = this.h / 2;
    if (this.y > 960  - this.h / 2) this.y = 960 - this.h / 2;
  }

  updatePaddleSize(multipleFactor: number) {
    this.h = this.hInitial * multipleFactor;
  }

  init(x: number) {
    this.x = x;
    this.y = 480;
    this.w = 20;
    this.hInitial = 150;
    this.h = 150;
  }
}
