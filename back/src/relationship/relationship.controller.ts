import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RelationshipDTO, RelationshipUpdate } from './relationship.dto';
import { RelationshipType } from './relationship.entity';
import { RelationshipService } from './relationship.service';

@Controller('relationships')
// @UseGuards(JwtGuard) COMMENTED FOR TESTING ONLY
export class RelationshipController {
  constructor(private relationshipService: RelationshipService) {}
  @Get('me')
  async getMyRelationships(
    @Res({ passthrough: true }) response: Response,
  ): Promise<RelationshipDTO[]> {
    return await this.relationshipService.userRelationships(response.locals.id);
  }

  @Post(':id')
  async updateRelationships(
    @Param('id', ParseUUIDPipe) peerId: string,
    @Res({ passthrough: true }) response: Response,
    @Body() relation: RelationshipUpdate,
  ): Promise<void> {
    console.log('Relation:', relation);
    console.log('Update relationship request received');
    await this.relationshipService.updateRelationship(
      response.locals.id,
      peerId,
      relation.type,
    );
  }
}
