import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { RelationshipController } from './relationship.controller';
import { Relationship } from './relationship.entity';
import { RelationshipService } from './relationship.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Relationship]),
    forwardRef(() => UserModule),
  ],
  providers: [RelationshipService],
  controllers: [RelationshipController],
  exports: [RelationshipService],
})
export class RelationshipModule {}
