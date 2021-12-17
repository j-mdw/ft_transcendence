import { IsBoolean, IsEmail, IsEnum, IsString, IsUUID } from 'class-validator';
import { PartialType, PickType } from '@nestjs/swagger';
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

  @IsString()
  twoFactorAuthenticationSecret?: string;

  @IsBoolean()
  isTwoFactorAuthenticationEnabled: boolean;

  constructor(user: User) {
    this.id = user.id;
    this.pseudo = user.pseudo;
    this.avatarPath = user.avatarPath;
    this.isTwoFactorAuthenticationEnabled =
      user.isTwoFactorAuthenticationEnabled;
    this.twoFactorAuthenticationSecret = user.twoFactorAuthenticationSecret;
  }
}

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
