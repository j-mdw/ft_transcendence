import { IsInt, IsBoolean,IsString, Min, Max } from 'class-validator';

export class PlayerDto {
  @IsInt()
  @Min(0)
  @Max(1280)
  x: number;

  @IsInt()
  @Min(0)
  @Max(960)
  y: number;

  @IsInt()
  @Min(0)
  w:number;

  @IsInt()
  @Min(0)
  h:number;

  @IsInt()
  @Min(0)
  hInitial:number;


  @IsInt()
  score: number;

  @IsInt()
  xScore: number;

//   @IsBoolean()
//   playing: boolean;

  @IsBoolean()
  victory: boolean;

  @IsBoolean()
  defeat: boolean;

  @IsBoolean()
  pressingUp: boolean;

  @IsBoolean()
  pressingDown: boolean;

  @IsString()
  userName: string;

  constructor(x: number, xscore: number, username: string) {
	this.x = x;
	this.y = 480;
	this.score = 0;
	this.w = 20;
	this.hInitial = 150;
	this.h = this.hInitial;
	this.xScore = xscore;
	this.userName = username;
	// this.playing = playing;
	this.victory = false;
	this.defeat = false;
	this.pressingUp = false;
	this.pressingDown = false;
  }

  updatePosition() {
	if (this.pressingUp)
		this.y -= 30;
	if (this.pressingDown)
		this.y += 30;
	if (this.y < this.h / 2)
		this.y = this.h / 2;
	if (this.y > 960 - this.h / 2)
		this.y = 960 - this.h / 2;
  }

  updatePaddleSize(multipleFactor: number){
	this.h = this.hInitial * multipleFactor;
	}

}