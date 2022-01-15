import { Message } from './message.entity';

export class MessageDTO {
  userId: string;
  pseudo: string;
  message: string;
  gameInvite: boolean;
  date: Date;

  constructor(msg: Message) {
    this.userId = msg.user.id;
    this.pseudo = msg.user.pseudo;
    this.message = msg.message;
    this.gameInvite = msg.gameInvite;
    this.date = msg.date;
  }
}
