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
import { UsersDTO } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  findAll() {
    return this.usersService.getUsers();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  async uppdateUser(@Param('id') id: string, @Body() data: string) {
    await this.usersService.update_pseudo(id, data);
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
    };
  }

  @Post() create(@Body() data: UsersDTO) {
    return this.usersService.createUser(data);
  }
}
