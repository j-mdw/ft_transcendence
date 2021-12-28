import { IsEnum, IsString, IsUUID } from 'class-validator';

export class messageToServerDTO {
  @IsString()
  message: string;
}

export class messageToClientDTO {
  id: string;
  pseudo: string;
  message: string;
}
