import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { Relationship, RelationshipType } from './relationship.entity';
import { RelationshipDTO } from './relationship.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class RelationshipService {
  constructor(
    @InjectRepository(Relationship)
    private relationshipRepository: Repository<Relationship>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async userRelationships(id: string): Promise<RelationshipDTO[]> {
    return (
      await this.relationshipRepository.find({
        where: { user: await this.userService.findEntity(id) },
      })
    ).map((relation) => new RelationshipDTO(relation));
  }

  async updateRelationship(
    userId: string,
    peerId: string,
    relationType: RelationshipType,
  ) {
    console.log('Relation:', relationType);
    const peer: User = await this.userService.findEntity(peerId);
    console.log('peer:', peer);
    const user: User = await this.userService.findEntity(userId);
    console.log('user', user);
    this.relationshipRepository.save({
      type: relationType,
      peer: peer,
      user: user,
    });
  }
}
