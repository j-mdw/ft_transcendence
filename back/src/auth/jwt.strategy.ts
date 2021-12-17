import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import TokenPayload from './tokenPayload.interface';
import { UserDTO } from 'src/user/user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: (req) => {
        if (!req || !req.cookies) {
          return null;
        }
        return req.cookies['access_token'];
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: TokenPayload): Promise<UserDTO> {
    const user = await this.userService.findById(payload.userId);
    console.log('VALIDATE');
    console.log(user);
    return user;
  }
}
