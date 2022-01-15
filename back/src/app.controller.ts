import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { JwtGuard } from './auth/jwt.guard';

@Controller()
@UseGuards(JwtGuard)
export class AppController {
  constructor() {}

  @Get('/avatars/ours/:filename')
  async seeUploadedFile(@Param('filename') filename: string, @Res() res) {
    return res.sendFile(filename, { root: './avatars/ours' });
  }
  @Get('/avatars/:filename')
  async seeUploadedFile2(@Param('filename') filename: string, @Res() res) {
    return res.sendFile(filename, { root: './avatars' });
  }
}
