import { IsBoolean, IsEmail, IsEnum, IsNumber, IsString, IsUUID } from 'class-validator';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { User } from './user.entity';

export class CreateUserDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  avatarPath?: string;
}

export class UserDTO {
  @IsUUID()
  id: string;

  @IsString()
  pseudo: string;

  @IsString()
  avatarPath: string;

  @IsNumber()
  victories: number;

  @IsNumber()
  defeats: number;

  @IsString()
  twoFactorAuthenticationSecret?: string;

  @IsBoolean()
  isTwoFactorAuthenticationEnabled: boolean;

  constructor(user: User) {
    this.id = user.id;
    this.pseudo = user.pseudo;
    this.avatarPath = user.avatarPath;
    this.victories = user.victories;
    this.defeats = user.defeats;
    this.isTwoFactorAuthenticationEnabled =
      user.isTwoFactorAuthenticationEnabled;
    this.twoFactorAuthenticationSecret = user.twoFactorAuthenticationSecret;
  }
}

export class UpdateUserDTO extends PartialType(
  OmitType(UserDTO, ['id'] as const),
) {}

export enum UserStatus {
  online,
  offline,
  playing,
}

export class UpdateUserStatus {
  id: string;
  status: UserStatus;

  constructor(id: string, status: UserStatus) {
    this.id = id;
    this.status = status;
  }
}
