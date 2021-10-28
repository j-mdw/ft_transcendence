import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlaModule } from './blabla/bla.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [BlaModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
