import { IsInt, Min } from 'class-validator';
import { PlayerDto } from "./player.dto";
import { GameTypeDto } from "./gameType.dto";

export class BallDto {
  @IsInt()
  @Min(0)
  x: number;

  @IsInt()
  @Min(0)
  y: number;

  @IsInt()
  xSpeed: number;

  @IsInt()
  ySpeed: number;



  @IsInt()
  @Min(0)
  radius: number;


  constructor(x: number, y: number) {
	this.x = x;
	this.y = y;
	this.xSpeed = this.getRandomInt(2, 5)
	this.xSpeed = this.getRandomInt(0, 1) ? this.xSpeed : -this.xSpeed;
	this.ySpeed = this.getRandomInt(2, 5)
	this.ySpeed = this.getRandomInt(0, 1) ? this.ySpeed : -this.ySpeed;

	this.radius = 15;
  }

  update(player1: PlayerDto, player2: PlayerDto, gameType: GameTypeDto){
	  this.edges(player1, player2, gameType);

	  this.x += this.xSpeed;
	  this.y += this.ySpeed;
  }

  edges(player1: PlayerDto, player2: PlayerDto, gameType: GameTypeDto) {
	if ((this.y + this.radius) > 960 || (this.y - this.radius) < 0)
	this.ySpeed *= -1;
	if ((this.x) >= 1280 && this.x < (1280 + this.xSpeed)){
		if (gameType.gameType !== 'multiballs')
			this.reinitializeBallPosition();
		player1.score++;
	}
	if ((this.x) <= 0 && this.x > this.xSpeed) {
		if (gameType.gameType !== 'multiballs')
			this.reinitializeBallPosition();
		player2.score++;
	}
  }

  playerPaddle(player: PlayerDto){
	let left = this.x - this.radius,
		right = this.x + this.radius,
		top = this.y - this.radius,
		bottom = this.y + this.radius;

	let pleft = player.x - (player.w / 2),
		pright = player.x + (player.w / 2),
		ptop = player.y - (player.h / 2),
		pbottom = player.y + (player.h / 2);
	if (this.x < 640){
		if (left <= pright && left > (pright + this.xSpeed) && top < pbottom && bottom > ptop )
		{
			this.xSpeed *= -1;
			this.xSpeed++;
		}
	}
	if (this.x > 640)
	{
		if (right >= pleft  && right < (pleft + this.xSpeed) && top < pbottom && bottom > ptop)
		{

			this.xSpeed *= -1;
			this.xSpeed--;
		  }
		}

    }

	reinitializeBallPosition(){
		this.xSpeed = this.getRandomInt(2, 5)
		this.xSpeed = this.getRandomInt(0, 1) ? this.xSpeed : -this.xSpeed;
		this.ySpeed = this.getRandomInt(2, 5)
		this.ySpeed = this.getRandomInt(0, 1) ? this.ySpeed : -this.ySpeed;
		this.x = 640;
		this.y = 480;
	}


	// 	/**
	// * Gets random int
	// * @param min
	// * @param max
	// * @returns random int - min & max inclusive
	// */
	getRandomInt(min: number, max: number) : number{
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}