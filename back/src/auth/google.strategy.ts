import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';
import { AuthService, Provider } from "./auth.service";
import { Logger } from '@nestjs/common';

import { Injectable } from '@nestjs/common';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

  constructor(
    private readonly authService: AuthService
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: 'http://localhost:3000/auth',
      scope: ['email', 'profile'],
    });
  }

  async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile
    
    try
   {
      console.log(profile);
      Logger.log("coucou =");
      const jwt: string = await this.authService.validateOAuthLogin(profile.id, Provider.GOOGLE);
      
      Logger.log(jwt);
      const user = {
        firstName: name.givenName,
        lastName: name.familyName,
        email: emails[0].value,
              // picture: photos[0].value,
        jwt
      }
      done(null, user);
    }
    catch(err)
    {
            // console.log(err)
      done(err, false);
    }
  }
}