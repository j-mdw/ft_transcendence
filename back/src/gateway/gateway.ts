import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  ParseUUIDPipe,
  UnauthorizedException,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { Channel } from 'src/channel/channel.entity';
import { ChannelService } from 'src/channel/channel.service';
import { ChannelParticipant } from 'src/channelParticipant/channelParticipant.entity';
import { UpdateUserStatus, UserStatus } from 'src/user/user.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { MessageToClientDTO, MessageToServerDTO } from './types/channel.dto';
import { HttpExceptionTransformationFilter } from './gateway.filter';
import { GatewayService } from './gateway.service';
// import { Logger } from '@nestjs/common';
import { GameManager } from './types/gameManager';
import { MatchMaker } from './types/matchMaker';
import { PaddleMoveDTO } from './types/game.dto';
import { IsEnum } from 'class-validator';
import { GameStyle } from './types/game';
// import { Server } from 'http';

export class GameStyleDTO {
  @IsEnum(GameStyle)
  pongType: GameStyle;
}

@UseFilters(HttpExceptionTransformationFilter)
@UsePipes(new ValidationPipe())
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly channelService: ChannelService,
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
          next(new UnauthorizedException('unknown user'));
        }
      } else {
        console.log('Socket verification: auth failed');
        next(new UnauthorizedException('auth failed'));
      }
    });
  }

  @WebSocketServer() server: Server;
  users = new Map<string, UpdateUserStatus>();

  // private logger: Logger = new Logger('GameGateway');

  async handleConnection(client: Socket): Promise<void> {
    client.emit('all-users-status', Array.from(this.users.values()));
    const user = this.users.get(client.id);
    if (user && this.gameManager.isPlaying(user.id)) {
      this.gameManager.reJoin(user.id, client);
      user.status = UserStatus.playing;
    }
    this.server.emit('status-update', this.users.get(client.id));
  }

  async handleDisconnect(client: Socket): Promise<void> {
    const usr: UpdateUserStatus = this.users.get(client.id);
    usr.status = UserStatus.offline;
    this.server.emit('status-update', usr);
    this.users.delete(client.id);

    // //on regarde si la deconnexion concerne un des joueurs principaux
    // if (this.socketList.length == 1) {//mode entrainement
    // 	this.cleanExit();
    // 	clearInterval(this.intervalId);
    // 	// this.logger.log(`coucou22`);
    // }
    // else if (client === this.socketList[0] || client === this.socketList[1]) //la deconnection vient du joueur 1 ou 2
    // {
    // 	//changement de scores sur base de donnee et sur page interhnet
    // 	let winner: string;
    // 	client === this.socketList[0] ? winner = "2": winner = "1";
    // 	if (client === this.socketList[0])
    // 		this.socketList.splice(0, 1);
    // 	else {
    // 		this.socketList.splice(1, 1);
    // 		this.logger.log("yipee")

    // 	}
    // 	this.logger.log("hey on est passe par la !")
    // 	for (let i in this.socketList) {
    // 		let socket = this.socketList[i];
    // 		socket.emit('gameWinner',  winner);
    // 	}
    // 	this.cleanExit();
    // 	clearInterval(this.intervalId);
    // }
    // else { //c'est un spectateur qui se deconnecte
    // 	this.socketList.forEach ((element, index) => {
    // 		if (element === client)
    // 		{
    // 			this.socketList.splice(index, 1);
    // 			this.logger.log(`${this.socketList.length} client connecte suite a deconnection`);
    // 		}
    // 	});
    // }
  }

  /* **** OLD PONG **** 

  socketList: Array<Socket> = [];

  gameData: GameDataDto = new GameDataDto('multiballs', 9);

  balls: Array<BallDto> = [];

  player1: PlayerDto;
  player2: PlayerDto;
  intervalId: NodeJS.Timer;

  @SubscribeMessage('gameInitialization')
  handleGameInitEvent(client: Socket, username: string): void {
    this.socketList.push(client);
    this.logger.log(`${this.socketList.length} client connecte`);
    if (this.socketList.length === 1) {
      this.player1 = new PlayerDto(40, 70, username);
      this.logger.log(`1er client connecte, ${this.player1.userName}`);
      this.player2 = this.player2 = new PlayerDto(1240, 1000, 'entrainement'); // typo
    }
    if (this.socketList.length === 2) {
      clearInterval(this.intervalId); // Why do we do this while there should not be any intervals?
      this.player1.y = 480;
      this.player1.score = 0;
      this.player2.y = 480;
      this.player2.score = 0; // on peut aussi delete le player 2 et le recreer
      this.player2.userName = username;
      this.logger.log(`2eme client connecte, ${this.player2.userName}`);
      for (let i = 0; i < this.gameData.numberOfBalls; i++)
        delete this.balls[i];
    }
    if (this.socketList.length > 2) {
      for (const i in this.socketList) {
        const socket = this.socketList[i];
        socket.emit('gameReturnFullData', {
          balls: this.balls,
          p1: this.player1,
          p2: this.player2,
        });
      }
    } else {
      for (let i = 0; i < this.gameData.numberOfBalls; i++)
        this.balls[i] = new BallDto(640, 480);
      for (const i in this.socketList) {
        const socket = this.socketList[i];
        socket.emit('gameReturnFullData', {
          balls: this.balls,
          p1: this.player1,
          p2: this.player2,
        });
      }
    }
  }

  @SubscribeMessage('gameLoop')
  handleGameLoop(client: Socket, message: void): void {
    this.intervalId = setInterval(() => {
      // this.logger.log(` au debut du scope ${this.intervalId}`);

      //nouvelle position de la balle
      for (const i in this.balls) {
        const ball = this.balls[i];
        ball.playerPaddle(this.player1);
        ball.playerPaddle(this.player2);
        ball.update(this.player1, this.player2, this.gameData);
      }

      //change paddlesize if needed
      if (this.gameData && this.gameData.changingPaddle)
        this.gameData.updatePlayersPaddleSize(this.player1, this.player2);

      //updating players position
      if (this.player1) this.player1.updatePosition();
      if (this.player2) this.player2.updatePosition();

      //send infos at each socket
      for (const i in this.socketList) {
        const socket = this.socketList[i];
        socket.emit('gameReturnFullData', {
          balls: this.balls,
          p1: this.player1,
          p2: this.player2,
        });
      }

      //c'est la qu'on checke le score et que l'on sort proprement si besoin
      if (this.player1.score >= 5 || this.player2.score >= 5) {
        //attention j'ai mis score a 2 pour les tests
        const winner = this.gameData.winOrLoose(this.player1, this.player2);
        // this.logger.log(`${winner} vient de gagner`);
        for (const i in this.socketList) {
          const socket = this.socketList[i];
          socket.emit('gameWinner', winner);
        }
        this.cleanExit();
        clearInterval(this.intervalId);
      }
      ////probablement a faire avec les rooms
    }, 1000 / 30); //Does interval make sense?
  }

  @SubscribeMessage('gameKeyPress')
  handleGamePaddleMove(
    client: Socket,
    data: { inputId: string; state: boolean },
  ): void {
    if (client === this.socketList[0]) {
      if (data.inputId === 'up') this.player1.pressingUp = data.state;
      else if (data.inputId === 'down') this.player1.pressingDown = data.state;
    } else if (client === this.socketList[1]) {
      if (data.inputId === 'up') this.player2.pressingUp = data.state;
      else if (data.inputId === 'down') this.player2.pressingDown = data.state;
    }
  }

  //servira pour integrer le type de jeu
  @SubscribeMessage('gameStyleOfGame')
  handleGameData(client: Socket, data: string): void {
    this.logger.log(`type of game renseigne`);

    if (data === 'multiballs') this.gameData = new GameDataDto('multiballs', 9);
    else if (data === 'rookie')
      this.gameData = new GameDataDto('rookie', 1, true);
    else this.gameData = new GameDataDto('classic');
  }

  @SubscribeMessage('gameCheckIfCleanlyExited')
  handleGameCheckIfCleanlyExited(client: Socket, message: void): void {
    this.logger.log(`on passe dans checkifcleanlyexited`);
    this.manageDeconnection(client);
  }

  cleanExit(): void {
    delete this.player1;
    delete this.player2;
    for (const i in this.balls) delete this.balls[i];
    while (this.balls.length) this.balls.pop();
    this.logger.log(`${this.balls.length} est la taille du tableau balls`);
    while (this.socketList.length) this.socketList.pop();
    this.logger.log(
      `${this.balls.length} est la taille du tableau bsocketlist`,
    );
  }

  manageDeconnection(client: Socket): void {
    //on verifie que l'on n'a pas deja fait une sortie propre
    if (this.socketList.length == 0)
      //on a deja fait le job
      return;
    //on regarde si la deconnexion concerne un des joueurs principaux
    else if (this.socketList.length == 1) {
      //mode entrainement
      this.cleanExit();
      clearInterval(this.intervalId);
      // this.logger.log(`coucou22`);
    } else if (client === this.socketList[0] || client === this.socketList[1]) {
      //la deconnection vient du joueur 1 ou 2
      //changement de scores sur base de donnee et sur page interhnet
      let winner: string;
      if (client === this.socketList[0]) {
        winner = '2';

      } else {
        winner = '1';
      }

      //Added by Julien for testing of match history and ladder:


      // Until here

      if (client === this.socketList[0]) this.socketList.splice(0, 1);
      else {
        this.socketList.splice(1, 1);
        this.logger.log('yipee');
      }
      this.logger.log('hey on est passe par la !');
      for (const i in this.socketList) {
        const socket = this.socketList[i];
        socket.emit('gameWinner', winner);
      }
      this.cleanExit();
      clearInterval(this.intervalId);
    } else {
      //c'est un spectateur qui se deconnecte
      this.socketList.forEach((element, index) => {
        if (element === client) {
          this.socketList.splice(index, 1);
          this.logger.log(
            `${this.socketList.length} client connecte suite a deconnection`,
          );
        }
      });
    }
  }
*/
  /* NEW PONG */

  /*
    EVENTS
    -> game-play @Body: GameStyleDTO
    -> game-leave
    <- game-update-from-player
    -> game-data-update

    Deconnection/Reconnection:
    - On connect: check if user is playing, if so, add it to the room, update player socket
    - On disconnect: do nothing? Just remove from room?
      /!\ Question: Will a disconneciton always trigger a page reload (=> mounted + destroy events)
    - On page Leave:
      - If currently playing: End game? Emit game-update with state End and clearInterval + pop game?
    
      Spectator:
    - game-watch event sent by client, redirecting him to game-watch page, where he suscribes to game-data-upade and received game-updates?
    - 
    
    Game Begin:
    - Add countdown? Use state + countdown
    - On reset, 3sec countdown?
    
    Game end:
    - Just set state to end? Then don't send anything, everything is done in front

    Private Games:
    - Need to find a smart system..


    Remove from queue on disconnect
  */
  gameManager = new GameManager(this.gatewayService);
  matchMaker = new MatchMaker(this.gameManager);

  @SubscribeMessage('game-play')
  async addPlayer(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameStyle: GameStyleDTO,
  ): Promise<void> {
    console.log('Queue before join:', this.matchMaker.queue);
    const user = this.users.get(client.id);
    if (user) {
      const userEntity = await this.userService.findById(user.id);
      if (!this.gameManager.isPlaying(user.id)) {
        this.matchMaker.join(
          client,
          userEntity.id,
          userEntity.pseudo,
          gameStyle.pongType,
        );
        user.status = UserStatus.playing;
        this.server.emit('status-update', this.users.get(client.id));
        console.log('Queue after join:', this.matchMaker.queue);
      }
    }
  }

  @SubscribeMessage('game-leave')
  removePlayer(@ConnectedSocket() client: Socket) {
    console.log('Queue before leave:', this.matchMaker.queue);
    const user = this.users.get(client.id);
    if (user) {
      this.matchMaker.leave(user.id);
      if (this.gameManager.isPlaying(user.id)) {
        this.gameManager.leaveGame(user.id);
      }
      // Leave game?
      user.status = UserStatus.online;
      this.server.emit('status-update', this.users.get(client.id));
      console.log('Queue after leave:', this.matchMaker.queue);
    }
  }

  @SubscribeMessage('game-update-from-player')
  updatePlayer(
    @ConnectedSocket() client: Socket,
    @MessageBody() paddleMove: PaddleMoveDTO,
  ) {
    const user = this.users.get(client.id);
    if (user) {
      const game = this.gameManager.getGame(paddleMove.gameId);
      if (game) {
        game.playerAction(user.id, paddleMove.keyChange);
      }
    }
  }
  /*
  
  *** CHAT MESSAGES (Channels + DM) ***

  Join:
  -> chat-join-channel (join room identified by channelID)
  <- chat-channel-joined (receive channel ID)
  -> chat-join-DM (join room identified by userID & peerID)
  <- chat-DM-joinned (receive channel ID)

  Messages:
  -> chat-channel-message (MessageToServerDTO)
  <- chat-message-to-client (MessageToClientDTO)
  chat-channel-message --> load participant, check if mute/ban, emit if
  chat-DM-message --> emit to both (no checks)

  Leave:
  -> chat-leave (channelId)

*/

  @SubscribeMessage('chat-join-channel')
  async joinChannel(
    // @MessageBody('channelId', ParseUUIDPipe) channelId: string,
    @MessageBody() channelId: string,
    @ConnectedSocket() client: Socket,
  ) {
    if (this.users.has(client.id)) {
      const uid = this.users.get(client.id).id;
      let user: User;
      let channel: Channel;
      try {
        user = await this.userService.findById(uid);
        console.log(channelId.toString());
        channel = await this.channelService.findOne(channelId.toString());
      } catch {
        throw new NotFoundException();
      }
      try {
        const participant = await this.channelService.findOneParticipant(
          user,
          channel,
        );
        if (!participant.banned) {
          client.join(channel.id);
          client.emit('chat-channel-joined', channel.id);
        }
      } catch {
        throw new ForbiddenException('User is not part of the channel');
      }
    } else {
      throw new UnauthorizedException('Unknown user');
    }
  }

  @SubscribeMessage('chat-join-DM')
  async joinDM(
    // @MessageBody('peerId', ParseUUIDPipe) peerId: string,
    @MessageBody() peerId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    console.log('Join DM request received');
    if (this.users.has(client.id)) {
      const uid = this.users.get(client.id).id;
      let user: User;
      let peer: User;
      try {
        user = await this.userService.findById(uid);
        peer = await this.userService.findById(peerId);
      } catch {
        throw new NotFoundException();
      }
      const chanName = this.gatewayService.createDMname(user.id, peer.id);
      if (chanName.length === 0) {
        throw new BadRequestException('User and peer have same id');
      } else {
        let channel: Channel;
        try {
          channel = await this.channelService.findOneDMchannel(chanName);
        } catch {
          channel = await this.channelService.createDMchannel(
            user,
            peer,
            chanName,
          );
        }
        client.join(channel.id);
        client.emit('chat-DM-joined', channel.id);
      }
    } else {
      throw new UnauthorizedException('Unknown user');
    }
  }

  @SubscribeMessage('chat-channel-message')
  async sendChannelMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() msg: MessageToServerDTO,
  ): Promise<void> {
    if (this.users.has(client.id)) {
      const uid = this.users.get(client.id).id;
      let user: User;
      let chan: Channel;
      try {
        user = await this.userService.findById(uid);
        chan = await this.channelService.findOne(msg.channelId);
      } catch {
        throw new NotFoundException();
      }
      let participant: ChannelParticipant;
      try {
        participant = await this.channelService.findOneParticipant(user, chan);
      } catch {
        throw new ForbiddenException('User is not a channel member');
      }
      if (participant.banned) {
        client.leave(chan.id);
        return;
      }
      if (participant.muted) {
        if (participant.muteEnd < new Date()) {
          await this.channelService.removeMute(participant);
        } else {
          return;
        }
      }
      this.server
        .to(msg.channelId)
        .emit(
          'chat-message-to-client',
          new MessageToClientDTO(user, chan.id, msg.message),
        );
      await this.channelService.addMessage(uid, chan.id, msg.message);
    }
  }

  @SubscribeMessage('chat-DM-message')
  async sendDM(
    @ConnectedSocket() client: Socket,
    @MessageBody() msg: MessageToServerDTO,
  ): Promise<void> {
    if (this.users.has(client.id)) {
      const uid = this.users.get(client.id).id;
      let user: User;
      let chan: Channel;
      try {
        user = await this.userService.findById(uid);
        chan = await this.channelService.findOne(msg.channelId);
      } catch {
        throw new NotFoundException();
      }
      try {
        await this.channelService.findOneParticipant(user, chan);
      } catch {
        throw new ForbiddenException('User is not a member');
      }
      this.server
        .to(msg.channelId)
        .emit(
          'chat-message-to-client',
          new MessageToClientDTO(user, chan.id, msg.message),
        );
      await this.channelService.addMessage(uid, chan.id, msg.message);
    }
  }

  @SubscribeMessage('chat-leave')
  async leaveChannel(
    // @MessageBody('channelId', ParseUUIDPipe) channelId: string,
    @MessageBody() channelId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const uid = this.users.get(client.id).id;
    let user: User;
    let chan: Channel;
    try {
      user = await this.userService.findById(uid);
      chan = await this.channelService.findOne(channelId);
    } catch {
      throw new NotFoundException();
    }
    try {
      await this.channelService.findOneParticipant(user, chan);
    } catch {
      throw new ForbiddenException('User is not a member');
    }
    client.leave(channelId);
  }
}

/*
    TESTING - CHAT

  - Join channel:
    - Channel does not exist -> 404
    - channel member try to join -> receive chat-channel-joined message w/ chan ID
    - non-member try to join -> 403
  - Join DM:
    - Peer exists:
      - 1st time -> creates channel, receive chat-DM-joined message w/ chan ID
      - Another time -> receive chat-DM-joined message w/ chan ID
    - Peer does not exist:
      - 404
  - Channel Message:
    - Empty message -> 400
    - Unknown channel -> 404
    - User not a participant -> 403
    - User is banned -> Do nothing
    - User is muted (not expired) -> Do nothing
    - User is muted (expired) -> set muted to false, send and save message
    - Normal -> save msg, Receive MessageToClientDTO
  
  - DM Message:
    - channel does not exist -> 404
    - User is not a participant -> 403
    - Empty message -> 400
    - Normal -> save msg, Receive MessageToClientDTO

  - Message test:
    - Deleted on channel delete
    - Deleted on user delete
*/
