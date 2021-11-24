import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppMiddleware implements NestMiddleware {
  constructor(
    // @Inject()
    private jwtService: JwtService,
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Entering middleware');
    if (req.cookies && req.cookies['access_token']) {
      try {
        const userId = this.jwtService.decode(req.cookies['access_token']);
        if (typeof userId == 'string') {
          res.locals.id = userId;
        } else {
          res.locals.id = userId[0];
        }
        console.log('ID from middleware: ', userId);
      } catch {
        console.log('decode throw - ');
        throw new ForbiddenException();
      }
    }
    console.log('Leaving middleware');
    next();
  }
}
