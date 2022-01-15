import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RelationshipDTO, RelationshipUpdateDTO } from './relationship.dto';
import { RelationshipService } from './relationship.service';

@Controller('relationships')
@UseGuards(JwtGuard)
export class RelationshipController {
  constructor(private relationshipService: RelationshipService) {}
  @Get('me')
  async getMyRelationships(
    @Res({ passthrough: true }) response: Response,
  ): Promise<RelationshipDTO[]> {
    return (
      await this.relationshipService.userRelationships(response.locals.id)
    ).map((relation) => new RelationshipDTO(relation));
  }

  @Post(':id')
  async updateRelationship(
    @Param('id', ParseUUIDPipe) peerId: string,
    @Res({ passthrough: true }) response: Response,
    @Body() relation: RelationshipUpdateDTO,
  ): Promise<void> {
    await this.relationshipService.updateRelationship(
      response.locals.id,
      peerId,
      relation.type,
    );
  }

  @Delete(':id')
  async deleteRelationship(
    @Param('id', ParseUUIDPipe) peerId: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.relationshipService.deleteRelation(response.locals.id, peerId);
  }
}
