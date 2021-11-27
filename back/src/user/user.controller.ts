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
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { Response } from 'express';
import { JwtGuard } from 'src/auth/jwt.guard';

@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  async findAll(): Promise<UserDTO[]> {
    return this.userService.getUsers();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserDTO> {
    return this.userService.findOne(id);
  }

  @Patch()
  updateUser(
    @Res({ passthrough: true }) response: Response,
    @Body() data: Partial<Omit<UserDTO, 'id'>>,
  ) {
    this.userService.update(response.locals.id, data);
    console.log('Patch update about to return');
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
    };
  }
}
