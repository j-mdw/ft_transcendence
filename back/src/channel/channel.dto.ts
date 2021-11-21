import { IsBase64, IsEnum, IsString } from 'class-validator';
import { ChannelType } from './channel.entity';
import { PartialType } from '@nestjs/swagger';

export class ChannelDTO {
  @IsString()
  name: string;

  @IsEnum(ChannelType)
  type: ChannelType;

  @IsBase64() //Could have issues when there is no password
  password: string;
}

export class UpdateChannelDTO extends PartialType(ChannelDTO) {}

// post /channels
// post /channels/1
