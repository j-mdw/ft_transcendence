import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlaModule } from './blabla/bla.ts/bla.module';

@Module({
  imports: [BlaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
