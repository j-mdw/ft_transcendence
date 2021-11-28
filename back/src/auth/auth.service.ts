import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserDTO, UserDTO } from 'src/user/user.dto';

@Injectable()
export class AuthService {
  constructor(
    // @Inject()
    private userService: UserService, // private readonly configService: ConfigService,
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
    console.log('user from addUser: ', user);
    console.log('email: ', user.email);
    try {
      await this.userService.findEmail(user.email);
    } catch(error) {
      console.log('User not found in the database: ', user.email);
      await this.userService.create(user);
    } finally {
      return await this.userService.findEmail(user.email);
    }
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
}
