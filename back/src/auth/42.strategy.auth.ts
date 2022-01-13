import { PassportStrategy } from '@nestjs/passport';
import { config } from 'dotenv';
import { Injectable } from '@nestjs/common';
//The purpose of the 2 lines below are to avoid compilation errors due to npm not finding passport-42 types
/* eslint-disable */
// @ts-ignore
import { Strategy, VerifyCallback } from 'passport-42';


config();

@Injectable()
export class school42Strategy extends PassportStrategy(Strategy, '42') {
  constructor() {
    super({
      clientID: process.env.SCHOOL_CLIENT_ID,
      clientSecret: process.env.SCHOOL_SECRET,
      callbackURL: `http://${process.env.HOST_NAME}/auth/callback/42`,
      scope: ['public'],
      provider: '42/redirect',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails } = profile;
    const user = {
      firstName: name.givenName,
      lastName: name.familyName,
      email: emails[0].value,
    };
    done(null, user);
  }
}