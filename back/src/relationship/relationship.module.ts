import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Relationship } from './relationship.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Relationship])],
  providers: [],
  controllers: [],
  exports: [],
})
export class UsersModule {}
