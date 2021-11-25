import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes/parse-int.pipe';
import { UsersService } from './user.service';
import { UserDTO } from './users.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

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

  @Post('upload/avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './avatars',
        filename: function (req, file, cb) {
          // const filename: string = path.parse(file.originalname).name;
          // const extension: string = path.parse(file.originalname).ext;
          // const filename: string = "test";
          // const extension: string =".jpg";

          cb(null, 'test.jpeg');
        },
      }),
    }),
  )
  async uploadFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(file.path);
    await this.usersService.update_avatar(id, file.path);
  }

  @Get('me/avatar')
  seeUploadedFile(@Res() res) {
    return res.sendFile('test.jpeg', { root: './avatars' });
  }
}
