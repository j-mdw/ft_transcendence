import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { HttpService, Injectable } from '@nestjs/common';

config();


const clientID = process.env.school42_CLIENT_ID;
const clientSecret = process.env.school42_SECRET;
const callbackURL = 'http://localhost:3000/auth/42';

// clientID: process.env.school42_CLIENT_ID,
// clientSecret: process.env.school42_SECRET,
// callbackURL: 'http://localhost:3000/auth/42',
// response_type: 'code',
// scope : 'identify',
// state : 'fff',

@Injectable()
export class school42Strategy extends PassportStrategy(Strategy, '42') {

  constructor(
		private http: HttpService,
	) {

    super({
        authorizationURL: `https://api.intra.42.fr/oauth/authorize?{stringify({
				client_id    : clientID,
				redirect_uri : callbackURL,
				response_type: 'code',
				scope        : 'public',
			}) }`,
			tokenURL        : 'https://discordapp.com/api/oauth2/token',
			scope           : 'public',
			clientID,
			clientSecret,
			callbackURL,
    });
  }

  async validate (accessToken: string): Promise<any> {
    const { data } = await this.http.get('https://api.intra.42.fr/v2/me', {
				headers: { Authorization: `Bearer ${ accessToken }` },
			})
			.toPromise();

    // done(null, user);
  }
}