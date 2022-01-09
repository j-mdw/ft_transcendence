import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchHistory } from './matchHistory.entity';
import { MatchHistoryService } from './matchHistory.service';

@Module({
  imports: [TypeOrmModule.forFeature([MatchHistory])],
  providers: [MatchHistoryService],
  controllers: [],
  exports: [MatchHistoryService],
})
export class MatchHistoryModule {}
