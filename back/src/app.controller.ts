import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import path from 'path/posix';
import { AppService } from './app.service';
import { JwtGuard } from './auth/jwt.guard';

@Controller()
@UseGuards(JwtGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get() //DELETE
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Get('/avatars/ours/:filename')
  async seeUploadedFile(@Param('filename') filename: string, @Res() res) {
    console.log('Avatar path:', filename);
    return res.sendFile(filename, { root: './avatars/ours' });
  }
}
