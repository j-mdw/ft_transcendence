import { Injectable, Post, InternalServerErrorException, HttpException } from '@nestjs/common';
import {UsersService} from '../user/user.service';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

export enum Provider
{
    GOOGLE = 'google'
}

@Injectable()
export class AuthService {

 // private readonly JWT_SECRET_KEY = 'C75RPHQZCrnjN0jGQ7AiEQ2L4J8Ef7DYwQSv3bItIsdyWwFya2FHRnPLzik7LaYZ6ERySVduJM0AjXquCW+DQaLekJTr82sV3U1q23U9+XKoL1SpbZm9KeVy6oXTuohGZkyJ52SVegDLZT6u0TkpkV/b/HCiv5A6I5KXMcTDHmF6qvuhv6iDjvdugbpsuE179Aq2F58tlhnRYCnvqiaJGD4rdkJ2aEuUWB2UGKUlzUb3BqHRwZU/RTJ3BGWL9N1b+GTUsuVx11OjXT4r7drJ/B6rZidIkB+/WnpWPo6+yWFQ20uGimX6Mcw5FTcVxoxrZdS+E2bZwOMnwsLhozEsIQ==';

  constructor(
    private usersService: UsersService,
    private readonly configService: ConfigService
  ) {}
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

  async addingUser(req)
  {

    // if (!req.user) {
    //   return 'No user from google'
    // }

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