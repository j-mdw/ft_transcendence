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
      user.avatarPath = this.userService.find_avatar();
      await this.userService.create(user);
    } finally {
      return await this.userService.findEmail(user.email);
    }
  }

  verify(token: string): any {
    try {
      const decoded = this.jwtService.verify(token);
      console.log('Verify: ', decoded);
      return decoded;
    } catch {
      console.log('Token verification failed');
      return null;
    }
  }

  async userExist(id: string): Promise<boolean> {
    if (await this.userService.findOne(id)) {
      return true;
    } else {
      return false;
    }
  }

  randomName(length: number) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const charLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charLength));
    }
    return result;
  }
}
