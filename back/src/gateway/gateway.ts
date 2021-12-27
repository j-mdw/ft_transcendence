import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  WsResponse,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UpdateUserStatus, UserStatus } from 'src/user/user.dto';
import { GatewayService } from './gateway.service';
import { BallDto } from "./gameDto/ball.dto";
import { PlayerDto } from "./gameDto/player.dto";
import { GameDataDto } from "./gameDto/gamedata.dto";
import { setInterval, clearInterval } from 'timers';
import { Logger } from '@nestjs/common';
// import { Server } from 'http';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly authService: AuthService,
    private readonly gatewayService: GatewayService,
    ) {}

  afterInit(srv: Server) {
    this.gatewayService.server = srv;
    srv.use(async (socket, next) => {
      const cookie = socket.handshake.headers.cookie;
      if (!cookie) {
        console.log('Socket verification: no token provided');
        next(new UnauthorizedException('authentication failed'));
      }
      let token = cookie.substring(cookie.indexOf('access_token'));
      const token_end = token.indexOf(';');
      if (token_end != -1) {
        token = token.slice(token.indexOf('=') + 1, token_end);
      } else {
        token = token.slice(token.indexOf('=') + 1);
      }
      const decoded = await this.authService.verify(token);
      if (decoded) {
        if (await this.authService.userExist(decoded['userId'])) {
          console.log('WS auth successful');
          this.users.set(
            socket.id,
            new UpdateUserStatus(decoded.userId, UserStatus.online),
          );
          socket.join(decoded.userId);//Joining a room with named after its own ID
          next();
        } else {
          console.log('Socket verification: unknown user');
          next(new UnauthorizedException('Unknown user'));
        }
      } else {
        console.log('Socket verification: auth failed');
        next(new UnauthorizedException('authentication failed'));
      }
    });
  }

  @WebSocketServer() server: Server;
  users = new Map<string, UpdateUserStatus>();

  private logger:Logger = new Logger('GameGateway');

  @SubscribeMessage('chat-message')
  handleEvent(@MessageBody() data: string): void {
    console.log('Message recieved: ' + data);
    this.server.emit('chat-message', data);
  }

  async handleConnection(client: Socket): Promise<void> {
    console.log('New user connected: ' + client.id);
    console.log('All connected users: ', this.users);
    client.emit('all-users-status', Array.from(this.users.values()));
    this.server.emit('status-update', this.users.get(client.id));
  }

  async handleDisconnect(client: Socket): Promise<void> {
    const usr: UpdateUserStatus = this.users.get(client.id);
    usr.status = UserStatus.offline;
    this.server.emit('status-update', usr);
    this.users.delete(client.id);
    console.log('User disconnected: ' + client.id);
	console.log('All connected users: ', this.users);


	// partie pour laurent

	this.logger.log(`Client disconnected of game: ${client.id}`);
	//on regarde si la deconnexion concerne un des joueurs principaux
	if (this.socketList.length <= 1) {//mode entrainement
		this.cleanExit();
		clearInterval(this.intervalId);
		this.logger.log(`coucou22`);
	}
	else if (client === this.socketList[0] || client === this.socketList[1]) //la deconnection vient du joueur 1 ou 2
	{
		//changement de scores sur base de donnee et sur page interhnet
		let winner: string;
		client === this.socketList[0] ? winner = "2": winner = "1";
		if (client === this.socketList[0])
			this.socketList.splice(0, 1);
		else {
			this.socketList.splice(1, 1);
			this.logger.log("yipee")

		}
		this.logger.log("hey on est passe par la !")
		for (let i in this.socketList) {
			let socket = this.socketList[i];
			socket.emit('gameWinner',  winner);
		}
		this.cleanExit();
		clearInterval(this.intervalId);
	}
	else { //c'est un spectateur qui se deconnecte
		this.socketList.forEach ((element, index) => {
			if (element === client)
			{
				this.socketList.splice(index, 1);
				this.logger.log(`${this.socketList.length} client connecte suite a deconnection`);
			}
		});
	}
  }


  ///Partie Laurent PongGame

  socketList: Array<Socket> = [];

  gameData: GameDataDto = new GameDataDto('classic', 2);

  balls: Array<BallDto> = [];

  player1: PlayerDto;
  player2: PlayerDto;
  intervalId: NodeJS.Timer;


  @SubscribeMessage('gameInitialization')
  handleGameInitEvent(client:Socket, username: string): void {

	this.socketList.push(client);
	this.logger.log(`${this.socketList.length} client connecte`);
	if (this.socketList.length === 1) {
		this.player1 = new PlayerDto(40, 70, username);
		this.logger.log(`1er client connecte, ${this.player1.userName}`);
		this.player2 = this.player2 = new PlayerDto(1240, 1000, "entrainement");
	}
	if (this.socketList.length === 2) {
		this.player1.y = 480;
		this.player1.score = 0;
		this.player2.y = 480;
		this.player2.score = 0;   // on peut aussi delete le player 2 et le recreer
		this.player2.userName = username;
		this.logger.log(`2eme client connecte, ${this.player2.userName}`);
		for(let i = 0; i < this.gameData.numberOfBalls; i++)
			delete this.balls[i];
	}
	if (this.socketList.length > 2){
		for (let i in this.socketList) {
			let socket = this.socketList[i];
			socket.emit('gameReturnFullData', { balls: this.balls, p1: this.player1, p2: this.player2 });
		}
	}
	else{
		for(let i = 0; i < this.gameData.numberOfBalls; i++)
		this.balls[i] = new BallDto(640, 480);
		for (let i in this.socketList) {
			let socket = this.socketList[i];
			socket.emit('gameReturnFullData', { balls: this.balls, p1: this.player1, p2: this.player2 });
		}
	}
  }

  @SubscribeMessage('gameLoop')
  handleGameLoop(client:Socket, message: void): void {
	this.intervalId = setInterval(() => {
		//nouvelle position de la balle
		for (let i in this.balls){
			let ball = this.balls[i];
			ball.playerPaddle(this.player1);
			ball.playerPaddle(this.player2);
			ball.update(this.player1, this.player2, this.gameData);
		}

		//change paddlesize if needed
		if (this.gameData && this.gameData.changingPaddle)
			this.gameData.updatePlayersPaddleSize(this.player1, this.player2);

		//updating players position
		this.player1.updatePosition();
		this.player2.updatePosition();

		//send infos at each socket
		for (let i in this.socketList) {
			let socket = this.socketList[i];
			socket.emit('gameReturnFullData', { balls: this.balls, p1: this.player1, p2: this.player2 });
		}

		//c'est la qu'on checke le score et que l'on sort proprement si besoin
		if (this.player1.score >= 2 || this.player2.score >= 2){//attention j'ai mis score a 2 pour les tests
			let winner = this.gameData.winOrLoose(this.player1, this.player2);
			this.logger.log(`${winner} vient de gagner`);
			for (let i in this.socketList) {
				let socket = this.socketList[i];
				socket.emit('gameWinner',  winner);
			}
			this.cleanExit();
			// delete this.player1;
			// delete this.player2;
			// for (let i in this.balls)
			// 	delete this.balls[i];
			// while (this.balls.length)
			// 	this.balls.pop();
			// this.logger.log(`${this.balls.length} est la taille du tableau balls`);
			// while (this.socketList.length)
			// 	this.socketList.pop();
			// 	this.logger.log(`${this.balls.length} est la taille du tableau bsocketlist`);

			// delete this.balls;
			//on sort de cette boucle setinterval
			clearInterval(this.intervalId);
			this.logger.log(`coucou`);
			return;
		}
		////probablement a faire avec les rooms
	}, 1000/60);

	}


  @SubscribeMessage('gameKeyPress')
  handleGamePaddleMove(client:Socket, data: {inputId: string, state: boolean}): void {
	if (client === this.socketList[0]){
		if (data.inputId === 'up')
			this.player1.pressingUp = data.state;
		else if (data.inputId === 'down')
			this.player1.pressingDown = data.state;
		}
	}


  @SubscribeMessage('gameKeyPress2')
  handleGamePaddleMove2(client:Socket, data: {inputId: string, state: boolean}): void {
	if (client === this.socketList[1]) {
		if (data.inputId === 'up')
			this.player2.pressingUp = data.state;
		else if (data.inputId === 'down')
			this.player2.pressingDown = data.state;
		}
	}

	//servira pour integrer le type de jeu
  @SubscribeMessage('gameTypeOfGame')
  handleGameData(client:Socket, data: string): void {
	this.logger.log(`type of game renseigne`);

	if (data === 'multiballs')
		this.gameData = new GameDataDto('multiballs', 9);
	else if (data === 'rookie')
		this.gameData = new GameDataDto('rookie', 1, true);
	else
		this.gameData = new GameDataDto('classic');
	}

	cleanExit(): void {
		// delete this.player1;
		// delete this.player2;
		//AREVOIR ++++ car cree une erreur sinon
		// a rajouter une fois les mnouvelles pages html faites
		for (let i in this.balls)
			delete this.balls[i];
		while (this.balls.length)
			this.balls.pop();
		this.logger.log(`${this.balls.length} est la taille du tableau balls`);
		while (this.socketList.length)
			this.socketList.pop();
			this.logger.log(`${this.balls.length} est la taille du tableau bsocketlist`);

	}
}
