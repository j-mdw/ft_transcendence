import { IsEmail, IsString } from 'class-validator';

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
