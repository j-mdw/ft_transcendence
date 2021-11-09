import { PassportStrategy } from '@nestjs/passport';
import { config } from 'dotenv';
import { AuthService, Provider } from "./auth.service";
import { HttpService, Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-42';


config();


// const clientID = process.env.school42_CLIENT_ID;
// const clientSecret = process.env.school42_SECRET;
// const callbackURL = 'http://localhost:3000/auth';

// clientID: process.env.school42_CLIENT_ID,
// clientSecret: process.env.school42_SECRET,
// callbackURL: 'http://localhost:3000/auth/42',
// response_type: 'code',
// scope : 'identify',



@Injectable()
export class school42Strategy extends PassportStrategy(Strategy, '42') {


	constructor(
		//private readonly authService: AuthService
	 ) 
	{
		super({
			clientID: process.env.SCHOOL_CLIENT_ID,
			clientSecret: process.env.SCHOOL_SECRET,
			callbackURL: 'http://localhost:3000/auth',
			scope: ['public'],
		  });
		
	}
		
	async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
		const { name, emails} = profile
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