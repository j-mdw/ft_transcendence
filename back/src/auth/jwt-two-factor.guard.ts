import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class JwtTwoFactorGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const decoded = this.authService.verify(request.cookies['token2fa']);
    if (decoded && (await this.authService.userHasAccess(decoded['userId']))) {
      console.log('huhuhu');
      return true;
    } else {
      console.log('jwt guard verify failure tutu');
      throw new UnauthorizedException();
    }
  }
}
