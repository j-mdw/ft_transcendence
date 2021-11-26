import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  googleLogin(req) {
    if (!req.user) {
      throw new HttpException(
        'user not found',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      message: 'User information from google',
      user: req.user,
    };
  }

  async addingUser(req) {
    if (await this.usersService.findEmail(req.user.email)) {
      return {
        message: 'the user exist in the database',
        user: await this.usersService.findEmail(req.user.email),
      };
    } else {
      await this.usersService.createUser(req.user);
      return {
        message: 'the user was created in the database',
        user: await this.usersService.findEmail(req.user.email),
      };
    }
  }

  async generateAvatar(id: string) {
    this.usersService.update_avatar(id, this.usersService.find_avatar());
  }
}
