import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    // @Inject()
    private jwtService: JwtService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // if (request.cookies && request.cookies['auth_token']) {
    try {
      this.jwtService.verify(request.cookies['access_token']);
      return true;
    } catch {
      console.log('Jwt Guard: ', request.cookies);
      return false;
    }
  }
  // return false;
}
// }
