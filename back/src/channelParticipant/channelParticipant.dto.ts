import { IsBoolean, IsDate, IsUUID, MinDate } from 'class-validator';
import { ChannelParticipant } from './channelParticipant.entity';
import { PartialType, OmitType } from '@nestjs/mapped-types';

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

  @MinDate(new Date())
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
  OmitType(ChannelParticipantDTO, ['userId', 'channelId'] as const),
) {}
