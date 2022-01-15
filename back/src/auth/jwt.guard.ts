import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const decoded = this.authService.verify(request.cookies['access_token']);
    if (decoded && (await this.authService.userHasAccess(decoded['userId']))) {
      return true;
    } else {
      throw new UnauthorizedException();
    }
  }
}
