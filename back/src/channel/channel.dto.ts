import { IsBase64, IsDate, IsEmail, IsEnum, IsString, IsUUID } from 'class-validator';
import { ChannelType } from './channel.entity';

export class ChannelDTO {
  @IsEnum(channelType)
  type: ChannelType;

  @IsBase64() //Could have issues when there is no password
  password: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}

// post /channels
// post /channels/1