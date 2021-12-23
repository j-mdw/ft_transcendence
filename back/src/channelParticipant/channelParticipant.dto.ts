import { IsBoolean, IsDate, IsUUID } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { ChannelParticipant } from './channelParticipant.entity';

export class ChannelParticipantDTO {
  @IsUUID()
  userId: string;

  @IsUUID()
  channelId: string;

  @IsBoolean()
  admin: boolean;

  @IsBoolean()
  banned: boolean;

  @IsBoolean()
  muted: boolean;

  @IsDate()
  muteEnd?: Date;

  constructor(participant: ChannelParticipant) {
    this.userId = participant.user.id;
    this.channelId = participant.channel.id;
    this.admin = participant.admin;
    this.banned = participant.banned;
    this.muted = participant.muted;
    this.muteEnd = participant.muteEnd;
  }
}

export class UpdateChannelParticipantDTO extends PartialType(
  ChannelParticipantDTO,
) {}
