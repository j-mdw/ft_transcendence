import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

/*
Description:
  The role of this middleware is to extract the sender ID from the jwt token
  It expects to find the token in the cookies, with the name 'access_token'
  If there is no jwt token, this middleware does not do anything
Throw:
  If there is an access_token cookie but it cannot be decoded because its format is wrong,
  the middleware throws a Forbidden exception
*/
@Injectable()
export class AppMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  use(req: Request, res: Response, next: NextFunction) {
    //console.log(req);
    if (req.cookies && req.cookies['access_token']) {
      try {
        const decoded = this.jwtService.decode(req.cookies['access_token']);
        if (decoded['userId']) {
          res.locals.id = decoded['userId'];
        } else {
          console.log('jwt decoded successfully but no userId found');
        }
      } catch {
        console.log('Middleware failed to decode access_token cookie');
        res.clearCookie('access_token');
        throw new UnauthorizedException();
      }
    } else {
      console.log('No cookie provided'); //DELETE
    }
    next();
  }
}
