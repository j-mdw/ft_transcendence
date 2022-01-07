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
import { Game } from "./../game/game";
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
          socket.join(decoded.userId); //Joining a room with named after its own ID
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
  handleEvent(@MessageBody() msg: string): void {
    // console.log('Message recieved: ' + data);
    this.server.emit('chat-message', msg);
  }

  async handleConnection(client: Socket): Promise<void> {
    // console.log('New user connected: ' + client.id);
    // console.log('All connected users: ', this.users);
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
	this.manageDeconnection(client);
  }


  ///Partie Laurent PongGame

  socketListClassic: Array<Socket> = [];
  socketListRookie: Array<Socket> = [];
  socketListMultiballs: Array<Socket> = [];
  gameList: Array<Game> = [];

  socketList: Array<Socket> = [];

  gameData: GameDataDto = new GameDataDto('multiballs');

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
		clearInterval(this.intervalId);
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
		// this.logger.log(` au debut du scope ${this.intervalId}`);

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
		if (this.player1)
			this.player1.updatePosition();
		if (this.player2)
			this.player2.updatePosition();

		//send infos at each socket
		for (let i in this.socketList) {
			let socket = this.socketList[i];
			socket.emit('gameReturnFullData', { balls: this.balls, p1: this.player1, p2: this.player2 });
		}

		//c'est la qu'on checke le score et que l'on sort proprement si besoin
		if (this.player1.score >= 5 || this.player2.score >= 5){//attention j'ai mis score a 2 pour les tests
			let winner = this.gameData.winOrLoose(this.player1, this.player2);
			// this.logger.log(`${winner} vient de gagner`);
			for (let i in this.socketList) {
				let socket = this.socketList[i];
				socket.emit('gameWinner',  winner);
			}
			this.cleanExit();
			clearInterval(this.intervalId);
		}
		////probablement a faire avec les rooms
	}, 1000/30);

	}


  @SubscribeMessage('gameKeyPress')
  handleGamePaddleMove(client:Socket, data: {inputId: string, state: boolean}): void {
	if (client === this.socketList[0]){
		if (data.inputId === 'up')
			this.player1.pressingUp = data.state;
		else if (data.inputId === 'down')
			this.player1.pressingDown = data.state;
		}

	else if (client === this.socketList[1]) {
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
		this.gameData = new GameDataDto('multiballs');
	else if (data === 'rookie')
		this.gameData = new GameDataDto('rookie');
	else
		this.gameData = new GameDataDto('classic');
	}

	@SubscribeMessage('gameCheckIfCleanlyExited')
  	handleGameCheckIfCleanlyExited(client:Socket, message: void): void {
		// this.logger.log(`on passe dans checkifcleanlyexited`);
		this.manageDeconnection(client);
	  }

	@SubscribeMessage('gameJoinRoom')
  	handleGameJoinRoom(client:Socket, room: string): void {
		  client.join(room);
		  this.logger.log(`on a rejoint ${room}`);

		  client.emit('gameJoinedRoom', room) //utile ou non ?
	  }

	@SubscribeMessage('gameLeaveRoom')
  	handleGameLeaveRoom(client:Socket, room: string): void {
		  client.leave(room);
		  this.logger.log(`on a quitte ${room}`);

		  client.emit('gameLeftRoom', room) //utile ou non ?
	  }

	  @SubscribeMessage('gameCheckListLength')
  	  handleGameCheckListLength(client:Socket, room: string): void {
		let length: number;
		let socketList = this.chooseSocketList(room);
		length = socketList.length;
		client.emit('gameSocketListLength', length);
	  }

	  @SubscribeMessage('gameAddToGameSocketList')
  	  handleGameAddToGameSocketList(client:Socket, data: {new: string, old: string}): void {
		let socketListOld = this.chooseSocketList(data.old); //on retire le client de l'ancienne socketList
		if (socketListOld) {
			socketListOld.forEach ((element, index) => {
				if (element === client)
				{
					socketListOld.splice(index, 1);
				}
			})
		}
		let socketListNew = this.chooseSocketList(data.new)  //on l'ajoute a la nouvelle socketList
		if (socketListNew){
			socketListNew.push(client);
		}
		this.logger.log(`taille classic : ${this.socketListClassic.length} , rookie : ${this.socketListRookie.length} , multiballs : ${this.socketListMultiballs.length}`);

	  }

	  @SubscribeMessage('gameRemoveFromGameSocketList')
  	  handleGameRemoveFromGameSocketList(client:Socket, data: string): void {
		this.logger.log(`coucouc ${data}`);
		let socketListOld = this.chooseSocketList(data);
		if (socketListOld) {
			socketListOld.forEach ((element, index) => {
				if (element === client)
				{
					socketListOld.splice(index, 1);
				}
			})
		}
		this.logger.log(` sortie taille classic : ${this.socketListClassic.length} , rookie : ${this.socketListRookie.length} , multiballs : ${this.socketListMultiballs.length}`);
	  }

	  @SubscribeMessage('gameGatherInfoAndCreateGame')
  	  handleGameGatherInfoAndCreateGame(client:Socket, data: {type: string, playername: string}): void {
		let socketList = this.chooseSocketList(data.type);
		let player1 = socketList[0];
		let player2 = socketList[1];
		let room = data.type;
		let player2Name = data.playername;
		this.gameList.push(new Game(player1, player2, "", player2Name, room));
		//dire au player 1 :on veut ton nom et te mettre dans la room
		//une fois que player 1 a repondu, toute la room ira sur page d'apres, avec debut de partie
		console.log(`le socketid de 2  est ${client.id} et celui de 1 est ${player1.id}`);
		player1.emit('gameGatherName', room);
	  }

	  @SubscribeMessage('gameLastInfosForGameCreation')
	  handleGameLastInfosForGameCreation(client:Socket, data: {room: string, name: string}): void {
		let game: Game;
		this.gameList.forEach ((element, index) => {
			if (element.roomName === data.room)
				game = this.gameList[index];
		})
		game.player1UserName = data.name;
		console.log(`voiciles noms 1 = ${game.player1UserName} 2 = ${game.player2UserName}`)
		//all datas are set, lets play
		//il faut changer de page, on envoie le message a tous les membres de la room
		this.server.to(game.roomName).emit('gameLetsPlay');

	  }

	cleanExit(): void {

///on fait cette fonction dans le destructeur de game

	// 	delete this.player1;
	// 	delete this.player2;
	// 	for (let i in this.balls)
	// 		delete this.balls[i];
	// 	while (this.balls.length)
	// 		this.balls.pop();
	// 	this.logger.log(`${this.balls.length} est la taille du tableau balls`);
	// 	while (this.socketList.length)
	// 		this.socketList.pop();
	// 		this.logger.log(`${this.balls.length} est la taille du tableau bsocketlist`);
	}

	manageDeconnection(client: Socket):void {
		//on verifie que l'on n'a pas deja fait une sortie propre
		if (this.socketList.length == 0) //on a deja fait le job
			return;

		//on regarde si la deconnexion concerne un des joueurs principaux
		else if (this.socketList.length == 1) {//mode entrainement
			this.cleanExit();
			clearInterval(this.intervalId);
			// this.logger.log(`coucou22`);
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

	chooseSocketList(name: string): Array<Socket> {
		if (name === "classic")
			return (this.socketListClassic);
		else if (name === "rookie")
			return (this.socketListRookie);
		else if (name === "multiballs")
			return (this.socketListMultiballs);
		else
			return; //on retourne indefini
		}
}
