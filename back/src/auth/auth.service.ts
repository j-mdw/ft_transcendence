import { Injectable, Post, InternalServerErrorException } from '@nestjs/common';
import {UsersService} from '../user/user.service';
import { sign } from 'jsonwebtoken';

export enum Provider
{
    GOOGLE = 'google'
}

@Injectable()
export class AuthService {

 // private readonly JWT_SECRET_KEY = 'C75RPHQZCrnjN0jGQ7AiEQ2L4J8Ef7DYwQSv3bItIsdyWwFya2FHRnPLzik7LaYZ6ERySVduJM0AjXquCW+DQaLekJTr82sV3U1q23U9+XKoL1SpbZm9KeVy6oXTuohGZkyJ52SVegDLZT6u0TkpkV/b/HCiv5A6I5KXMcTDHmF6qvuhv6iDjvdugbpsuE179Aq2F58tlhnRYCnvqiaJGD4rdkJ2aEuUWB2UGKUlzUb3BqHRwZU/RTJ3BGWL9N1b+GTUsuVx11OjXT4r7drJ/B6rZidIkB+/WnpWPo6+yWFQ20uGimX6Mcw5FTcVxoxrZdS+E2bZwOMnwsLhozEsIQ==';

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

  async validateOAuthLogin(thirdPartyId: string, provider: Provider): Promise<string>
  {
    try 
    {
            // You can add some registration logic here, 
            // to register the user using their thirdPartyId (in this case their googleId)
            // let user: IUser = await this.usersService.findOneByThirdPartyId(thirdPartyId, provider);
            
            // if (!user)
                // user = await this.usersService.registerOAuthUser(thirdPartyId, provider);
                
       const payload = {
          thirdPartyId,
          provider
        }

        const jwt: string = sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME });
        return jwt;
    }
    catch (err)
    {
      throw new InternalServerErrorException('validateOAuthLogin', err.message);
    }
  }

}