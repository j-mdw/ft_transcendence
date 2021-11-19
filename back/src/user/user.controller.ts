import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  HttpStatus,
} from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes/parse-int.pipe';
import { UsersService } from './user.service';
import { UserDTO } from './user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }
  @Get()
  async findAll() {
    return await this.usersService.getUsers();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id) {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() data: UserDTO) {
    await this.usersService.update(id, data);
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
    };
  }
  //Don't think we'll be using this as user creation is done through auth
  // @Post()
  // async create(@Body() data: UserDTO) {
  //   return await this.usersService.create(data);
  // }
}
