import {
    Body,
    Controller,
    Delete,
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
      async uppdateUser(@Param('id') id: string, @Body() data: Partial<UsersDTO>) {
        await this.usersService.update(id, data);
        return {
          statusCode: HttpStatus.OK,
          message: 'User updated successfully',
        };
    }
  

    @Post() create(@Body() data: UsersDTO) {
      return this.usersService.createUser(data);
    }
  
    // @Patch(':id')
    // async editUser(@Body() note: User, @Param('id') id: number): Promise<User> {
    //   const noteEdited = await this.usersService.editUser(id, user);
    //   return noteEdited;
    // }
  
    // @Delete(':id')
    // remove(@Param('id', ParseIntPipe) id) {
    //   this.usersService.remove(id);
    // }
  }