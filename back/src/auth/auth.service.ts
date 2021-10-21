import { Injectable } from '@nestjs/common';
import {UsersService} from '../user/user.service'

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
    if (!req.user) {
      return 'No user from google'
    }

    return {
      message: 'User information from google',
      user: req.user
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