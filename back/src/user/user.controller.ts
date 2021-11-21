import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO, UpdateUserDTO } from './user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UserService) {}
  @Get()
  async findAll(): Promise<UserDTO[]> {
    return await this.usersService.getUsers();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserDTO> {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateUserDTO,
  ) {
    await this.usersService.update(id, data);
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
    };
  }
}
