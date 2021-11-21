import { IsEmail, IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class UserDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  pseudo: string;
}

export class UpdateUserDTO extends PartialType(UserDTO) {}
