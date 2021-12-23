import { IsEnum, IsString, IsUUID } from 'class-validator';
import { ChannelType } from './channel.entity';
import { Channel } from './channel.entity';
import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';

export class ChannelDTO {
  @IsUUID()
  id: string;

  @IsString() 
  name: string;

  @IsEnum(ChannelType)
  type: ChannelType;

  @IsUUID()
  owner: string;

  constructor(channel: Channel) {
    this.id = channel.id;
    this.name = channel.name;
    this.type = channel.type;
    this.owner = channel.owner.id;
    console.log('channel dto owner: ', channel.owner);
  }
}

export class ChannelPassword {
  @IsString()
  password: string;
}

export class CreateChannelDTO extends IntersectionType(
  PickType(ChannelDTO, ['name', 'type'] as const),
  PartialType(ChannelPassword),
) {}

export class UpdateChannelDTO extends IntersectionType(
  PickType(ChannelDTO, ['type'] as const),
  PartialType(ChannelPassword),
) {}
