import { Injectable, Post } from '@nestjs/common';
import {UsersService} from '../user/user.service'
import { UsersDTO } from '../user/users.dto'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  googleLogin(req) {
    if (!req.user) {
      return 'No user from google'
    }

    return {
      message: 'User information from google',
      user: req.user
    }
  }

  school42Login(req) {
    // if (!req.user) {
    //   return 'No user from 42'
    // }

    // return {
    //   message: 'User information from google',
    //   user: req.user
    // }
    return '42'
  }

  randString(length: number) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

  async createRandomUser()
  {
    var usr: UsersDTO = {
      id: this.randString(12),
      firstName: this.randString(8),
      lastName: this.randString(10),
      email: this.randString(6) + '@' + this.randString(5) + ".lala"
    }
  
    if (await this.usersService.findEmail(usr.email)) {
      return {
        message: 'the user exist in the database',
        user: await this.usersService.findEmail(usr.email)
      }
    }
    else {
      this.usersService.createUser(usr);
      return {
        message: 'the user was created in the database',
        user: await this.usersService.findEmail(usr.email)
      }
    }
  }

  async addingUser(req)
  {

    if (!req.user) {
      return 'No user from google'
    }

    if(await this.usersService.findEmail(req.user.email))
    {
      return {
        message: 'the user exist in the database',
        user: await this.usersService.findEmail(req.user.email)
      }
    }
    else
    {
      this.usersService.createUser(req.user);
      return {
        message: 'the user was created in the database',
        user: await this.usersService.findEmail(req.user.email)
      }
    }
  }

}