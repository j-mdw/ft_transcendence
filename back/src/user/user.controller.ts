import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  HttpStatus,
  ParseUUIDPipe,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO, UpdateUserDTO } from './user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { JwtGuard } from 'src/auth/auth.guard';

@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  async findAll(): Promise<UserDTO[]> {
    return await this.userService.getUsers();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserDTO> {
    return await this.userService.findOne(id);
  }

  @Patch()
  async updateUser(@Res() response: Response, @Body() data: UpdateUserDTO) {
    await this.userService.update(response.locals.id, data);
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
    };
  }
}
