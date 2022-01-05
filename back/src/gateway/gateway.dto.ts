import { IsEnum, IsString, IsUUID, Length } from 'class-validator';
import { User } from 'src/user/user.entity';

export class MessageToServerDTO {
  @IsUUID()
  channelId: string;
  @IsString()
  @Length(1)
  message: string;
}

export class MessageToClientDTO {
  channelId: string;
  userId: string;
  pseudo: string;
  message: string;

  constructor(user: User, channelId: string, msg: string) {
    this.channelId = channelId;
    this.userId = user.id;
    this.pseudo = user.pseudo;
    this.message = msg;
  }
}
