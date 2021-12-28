import { IsBase64, IsEnum, IsString, IsUUID } from 'class-validator';
import { Relationship, RelationshipType } from './relationship.entity';

export class RelationshipDTO {
  @IsUUID()
  peerId: string;

  @IsEnum(RelationshipType)
  type: RelationshipType;

  constructor(relationship: Relationship) {
    this.peerId = relationship.peer.id;
    this.type = relationship.type;
  }
}

export class RelationshipUpdateDTO {
  @IsEnum(RelationshipType)
  type: RelationshipType;
}
