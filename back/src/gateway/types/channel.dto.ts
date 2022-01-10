import { Optional } from '@nestjs/common';
import { IsBoolean, IsString, IsUUID, Length } from 'class-validator';
import { User } from 'src/user/user.entity';

export class MessageToServerDTO {
  @IsUUID()
  channelId: string;
  @IsString()
  @Length(1)
  message: string;
  @Optional()
  @IsBoolean()
  gameInvite?: boolean;
}

export class MessageToClientDTO {
  channelId: string;
  userId: string;
  pseudo: string;
  message: string;
  gameInvite?: boolean;

  constructor(
    user: User,
    channelId: string,
    msg: string,
    gameInvite?: boolean,
  ) {
    this.channelId = channelId;
    this.userId = user.id;
    this.pseudo = user.pseudo;
    this.message = msg;
    if (gameInvite) {
      this.gameInvite = gameInvite;
    }
  }
}
