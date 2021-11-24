import { IsEmail, IsString } from 'class-validator';
import { PartialType, PickType } from '@nestjs/swagger';

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

// export class UpdateUserDTO extends PartialType(UserDTO) {}

export class UpdateUserDTO extends PickType(UserDTO, ['pseudo']) {}
