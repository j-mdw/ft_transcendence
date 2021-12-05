import { IsInt, Min } from 'class-validator';
import { PlayerDto } from "./player.dto";

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
  acceleration: number;

  @IsInt()
  @Min(0)
  radius: number;

  constructor(x: number, y: number) {
	this.x = x;
	this.y = y;
	this.xSpeed = 2;
	this.ySpeed = -5;
	this.acceleration = 0;
	this.radius = 15;
  }

  update(player1: PlayerDto, player2: PlayerDto){
	  this.edges(player1, player2);

	  this.x += this.xSpeed;
	  this.y += this.ySpeed;
	  this.xSpeed += this.acceleration
  }

  edges(player1: PlayerDto, player2: PlayerDto) {
	if ((this.y + this.radius) > 960 || (this.y - this.radius) < 0)
	this.ySpeed *= -1;
	if ((this.x) > 1280){
		this.reinitializeBallPosition();
		player1.score++;
	}
	if ((this.x) < 0) {
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
		this.xSpeed *= -1;
		this.x = 640;
		this.y = 480;
	}
}