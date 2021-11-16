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

  ) 
  {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: 'http://localhost:3000/auth/callback/google',
      scope: ['email', 'profile'],
      provider: "42/redirect",
    });
  }

  async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
      const { name, emails, photos } = profile
      const user = {
        firstName: name.givenName,
        lastName: name.familyName,
        email: emails[0].value,
        // picture: photos[0].value,
        // accessToken
      }
      done(null, user);
    }
}