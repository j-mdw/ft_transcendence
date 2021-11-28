import { IsBase64, IsEnum, IsString, IsUUID } from 'class-validator';
import { ChannelType } from './channel.entity';
import { PartialType } from '@nestjs/swagger';
import { Channel } from './channel.entity';
import { UserDTO } from 'src/user/user.dto';

export class ChannelDTO {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsEnum(ChannelType)
  type: ChannelType;

  owner: UserDTO;

  constructor(channel: Channel) {
    this.id = channel.id;
    this.name = channel.name;
    this.type = channel.type;
  }
}

export class CreateChannelDTO {
  @IsString()
  name!: string;

  @IsEnum(ChannelType)
  type!: ChannelType;

  @IsBase64() //Could have issues when there is no password
  password!: string;
}

export class UpdateChannelDTO {
  @IsUUID()
  id!: string;

  @IsEnum(ChannelType)
  type?: ChannelType;

  @IsBase64() //Could have issues when there is no password
  password?: string;
}


// post /channels
// post /channels/1
