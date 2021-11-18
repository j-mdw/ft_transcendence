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
import { UserDTO } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  async findAll() {
    return await this.usersService.getUsers();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id) {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  async uppdateUser(@Param('id') id: string, @Body() data: string) {
    await this.usersService.update_pseudo(id, data);
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
    };
  }

  @Post()
  async create(@Body() data: UserDTO) {
    return await this.usersService.createUser(data);
  }
}
