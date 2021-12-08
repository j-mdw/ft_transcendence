import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { User } from '../../user/user.entity';
import { UserService } from '../../user/user.service';
import { toFileStream } from 'qrcode';
import { Response } from 'express';

@Injectable()
export class TwoFactorAuthenticationService {
  constructor(private readonly userService: UserService) {}

  public async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      user.id,
      process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME,
      secret,
    );

    await this.userService.setTwoFactorAuthenticationSecret(secret, user.id);
    return {
      secret,
      otpauthUrl,
    };
  }

  public isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    userSecret: string,
  ) {
    console.log(twoFactorAuthenticationCode);
    console.log(userSecret);
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: userSecret,
    });
  }

  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }
}
