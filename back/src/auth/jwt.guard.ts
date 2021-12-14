import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtGuard implements CanActivate {
  // constructor(private jwtService: JwtService) {}
  // canActivate(
  //   context: ExecutionContext,
  // ): boolean | Promise<boolean> | Observable<boolean> {
  //   const request = context.switchToHttp().getRequest();
  //   try {
  //     this.jwtService.verify(request.cookies['access_token']);
  //     return true;
  //   } catch {
  //     console.log('Jwt Guard: verification failed');
  //     return false;
  //   }
  // }
  //!\ Only checking if token is valid, but not checking if user exist in the DB!!
  constructor(
    // @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // console.log("auth middleware about to verify token");
    const decoded = this.authService.verify(request.cookies['access_token']);
    // console.log('Verif output:', decoded);
    if (decoded) {
      return true;
    } else {
      console.log('jwt guard verify failure');
      return false;
    }
  }
}
