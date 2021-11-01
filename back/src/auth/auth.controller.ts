import { Controller, Get, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AuthController {
  constructor(private readonly appService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    //const data = this.appService.googleLogin(req)
    const data = await this.appService.addingUser(req)
    // const jwt: string = req.user.jwt;
    // if (jwt)
    //   res.redirect('http://localhost:4200/login/succes/' + jwt);
    // else 
    //   res.redirect('http://localhost:4200/login/failure');
    return {data}
  }

  @Get('42')
  @UseGuards(AuthGuard('42'))
  async school42Auth(@Req() req) {}

  @Get('redirect')
  @UseGuards(AuthGuard('42/redirect'))
  async school42AuthRedirect(@Req() req) {
    const data = this.appService.school42Login(req)
    //const data = await this.appService.addingUser(req)
    return {data}
  }
}
