import { IsBoolean, IsDate } from 'class-validator';

export class ChannelParticipantDTO {
  @IsBoolean()
  admin: boolean;

  @IsBoolean()
  banned: boolean;

  @IsBoolean()
  muted: boolean;

  @IsDate()
  muteEnd: Date;
}
