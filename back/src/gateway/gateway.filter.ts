import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(HttpException)
export class HttpExceptionTransformationFilter extends BaseWsExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const properException = new WsException(exception.getResponse());
    console.log('WS exception filter about to emit');
    super.catch(properException, host);
  }
}
