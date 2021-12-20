import { IsBoolean, IsDate } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class ChannelParticipantDTO {
  @IsBoolean()
  admin: boolean;

  @IsBoolean()
  banned: boolean;

  @IsBoolean()
  muted: boolean;

  @IsDate()
  muteEnd?: Date;
}

export class UpdateChannelParticipantDTO extends PartialType(
  ChannelParticipantDTO,
) {}
