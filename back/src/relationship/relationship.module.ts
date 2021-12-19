import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { GatewayModule } from 'src/gateway/gateway.module';
import { UserModule } from 'src/user/user.module';
import { RelationshipController } from './relationship.controller';
import { Relationship } from './relationship.entity';
import { RelationshipService } from './relationship.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Relationship]),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => GatewayModule),
  ],
  providers: [RelationshipService],
  controllers: [RelationshipController],
  exports: [RelationshipService],
})
export class RelationshipModule {}
