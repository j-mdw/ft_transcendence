import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { UserDTO } from 'src/user/user.dto';

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

  // randString(length: number): string {
  //   let result = '';
  //   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //   const charactersLength = characters.length;
  //   for (let i = 0; i < length; i++) {
  //     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  //   }
  //   return result;
  // }

  // async createRandomUser() {
  //   const usr: UserDTO = {
  //     firstName: this.randString(8),
  //     lastName: this.randString(10),
  //     email: this.randString(6) + '@' + this.randString(5) + '.lala',
  //     pseudo: this.randString(5),
  //     picturePath: undefined,
  //   };
  //   if (await this.usersService.findEmail(usr.email)) {
  //     return {
  //       message: 'the user exists in the database',
  //       user: await this.usersService.findEmail(usr.email),
  //     };
  //   } else {
  //     await this.usersService.create(usr);
  //     console.log(await this.usersService.findEmail(usr.email));
  //     return {
  //       message: 'the user was created in the database',
  //       user: await this.usersService.findEmail(usr.email),
  //     };
  //   }
  // }

  async addingUser(req) {
    if (await this.usersService.findEmail(req.user.email)) {
      return {
        message: 'the user exist in the database',
        user: await this.usersService.findEmail(req.user.email),
      };
    } else {
      await this.usersService.create(req.user);
      return {
        message: 'the user was created in the database',
        user: await this.usersService.findEmail(req.user.email),
      };
    }
  }
}
