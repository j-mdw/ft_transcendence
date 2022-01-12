import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserDTO, UserDTO } from 'src/user/user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
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

  async addUser(user: CreateUserDTO): Promise<UserDTO> {
    try {
      await this.userService.findByEmail(user.email);
    } catch (error) {
      console.log('User not found in the database: ', user.email);
      user.avatarPath = this.userService.find_avatar();
      await this.userService.create(user);
    } finally {
      return new UserDTO(await this.userService.findByEmail(user.email));
    }
  }

  verify(token: string): any {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded;
    } catch {
      console.log('Token verification failed');
      return null;
    }
  }

  async userHasAccess(id: string): Promise<boolean> {
    try {
      const user = await this.userService.findById(id);
      if (!user.banned) {
        return true;
      } else {
        return false;
      }
    } catch {
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
