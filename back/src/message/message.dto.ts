import { IsString } from 'class-validator';
import { Message } from './message.entity';

export class messageToServerDTO {
  @IsString()
  message: string;
}

export class messageToClientDTO {
  id: string;
  pseudo: string;
  message: string;
}

export class MessageDTO {
  userId: string;
  pseudo: string;
  message: string;

  constructor(msg: Message) {
    this.userId = msg.user.id;
    this.pseudo = msg.user.pseudo;
    this.message = msg.message;
  }
}
