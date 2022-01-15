import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  ParseUUIDPipe,
  UseGuards,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { BanUserDTO, UpdateUserDTO, UserDTO } from './user.dto';
import { Response } from 'express';
import { JwtGuard } from 'src/auth/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ChannelDTO } from 'src/channel/channel.dto';
import { MatchHistoryDTO } from 'src/matchHistory/matchHistory.dto';

@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  async findAll(): Promise<UserDTO[]> {
    return (await this.userService.getUsers()).map((user) => new UserDTO(user));
  }

  @Get('me')
  async findMe(
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserDTO> {
    return new UserDTO(await this.userService.findById(response.locals.id));
  }

  @Get('channels')
  async findMyChannels(
    @Res({ passthrough: true }) response: Response,
  ): Promise<ChannelDTO[]> {
    return (await this.userService.findChannels(response.locals.id))
      .filter((channel) => !channel.DM)
      .map((channel) => new ChannelDTO(channel));
  }

  @Get('matches/:id')
  async findMatchHistory(
    @Param('id', ParseUUIDPipe) userId: string,
  ): Promise<MatchHistoryDTO[]> {
    return await this.userService.getMatches(userId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserDTO> {
    return new UserDTO(await this.userService.findById(id));
  }

  @Patch()
  async updateUser(
    @Res({ passthrough: true }) response: Response,
    @Body() data: UpdateUserDTO,
  ): Promise<void> {
    await this.userService.update(response.locals.id, data);
  }

  @Patch('admin/:id')
  async adminAction(
    @Res({ passthrough: true }) response: Response,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() ban: BanUserDTO,
  ): Promise<void> {
    await this.userService.adminUpdate(response.locals.id, id, ban.ban);
  }

  @Delete()
  deleteAccount(@Res({ passthrough: true }) response: Response) {
    return this.userService.delete(response.locals.id);
  }

  @Delete('delete/avatar')
  async beforeUpload(@Res({ passthrough: true }) response: Response) {
    const user = await this.userService.findById(response.locals.id);
    if (user.avatarPath.search('./avatars/ours/') !== 0) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const fs = require('fs');

      if (fs.existsSync(user.avatarPath)) {
        try {
          fs.unlinkSync(user.avatarPath);
        } catch (err) {
          throw err;
        }
      }
    }
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
    await this.userService.update_avatar(response.locals.id, file.path);
  }
}
