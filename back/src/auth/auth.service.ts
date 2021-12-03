import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserDTO, UserDTO } from 'src/user/user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    // @Inject()
    private userService: UserService, // private readonly configService: ConfigService,
    private jwtService: JwtService,
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

  async addUser(user: CreateUserDTO): Promise<UserDTO> {
    try {
      await this.userService.findEmail(user.email);
    } catch (error) {
      console.log('User not found in the database: ', user.email);
      await this.userService.create(user);
    } finally {
      return await this.userService.findEmail(user.email);
    }
  }

  async verify(token: string): Promise<any> {
    try {
      return await this.jwtService.verify(token);
    } catch {
      console.log('Token verification failed');
      return false;
    }
  }

  async userExist(id: string): Promise<boolean> {
    if (await this.userService.findOne(id)) {
      return true;
    } else {
      return false;
    }
  }
}
