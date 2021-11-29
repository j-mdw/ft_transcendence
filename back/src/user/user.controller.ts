import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { Response } from 'express';
import { JwtGuard } from 'src/auth/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  findAll(): Promise<UserDTO[]> {
    return this.userService.getUsers();
  }

  @Get('me')
  findMe(@Res({ passthrough: true }) response: Response): Promise<UserDTO> {
    return this.userService.findOne(response.locals.id);
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
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
    };
  }

  @Delete()
  deleteAccount(@Res({ passthrough: true }) response: Response) {
    return this.userService.delete(response.locals.id);
  }

  @Post('upload/avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './avatars',
        filename: function (req, file, cb) {
          const new_name = req.res.locals.id;
          const extArray = file.mimetype.split('/');
          const extension = extArray[extArray.length - 1];
          cb(null, new_name + '.' + extension);
        },
      }),
    }),
  )
  async uploadFile(
    @Res({ passthrough: true }) response: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(file.path);
    await this.userService.update_avatar(response.locals.id, file.path);
  }

  @Get('me/avatar')
  seeUploadedFile(@Res() res) {
    return res.sendFile(res.locals.id + '.' + 'jpeg', { root: './avatars' });
  }
}
