import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { Relationship, RelationshipType } from './relationship.entity';
import { RelationshipDTO } from './relationship.dto';
import { User } from 'src/user/user.entity';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ServerStreamFileResponseOptions } from 'http2';
import { AppGateway } from 'src/gateway/gateway';
import { GatewayService } from 'src/gateway/gateway.service';

@Injectable()
export class RelationshipService {
  constructor(
    @InjectRepository(Relationship)
    private relationshipRepository: Repository<Relationship>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => GatewayService))
    private gatewayService: GatewayService,
  ) {}

  async userRelationships(id: string): Promise<RelationshipDTO[]> {
    return (
      await this.relationshipRepository.find({
        where: { user: await this.userService.findEntity(id) },
      })
    ).map((relation) => new RelationshipDTO(relation));
  }

  async findRelation(user: User, peer: User): Promise<Relationship[]> {
    const relation = new Array<Relationship>(2);
    relation[0] = await this.relationshipRepository.findOneOrFail({
      where: {
        user: user,
        peer: peer,
      },
    });
    relation[1] = await this.relationshipRepository.findOneOrFail({
      where: {
        user: peer,
        peer: user,
      },
    });
    return relation;
  }

  //Update/Creation received from userId regarding its relatin with peerId
  //Throw 403 (Forbidden) if userId try to update the relationship while being blocked by peerId
  async updateRelationship(
    userId: string,
    peerId: string,
    relationType: RelationshipType,
  ) {
    // @WebSocketServer() server: Server;
    if (userId == peerId) {
      throw new BadRequestException('user and peer cannot have same id');
    }
    const user: User = await this.userService.findEntity(userId);
    const peer: User = await this.userService.findEntity(peerId);
    let relation = new Array<Relationship>(2);
    let userRelation = null;
    let peerRelation = null;
    try {
      relation = await this.findRelation(user, peer);
      userRelation = relation[0].type;
      peerRelation = relation[1].type;
    } catch {
      console.log('No relationship exists');
    } finally {
      if (relation[1] && relation[1].type == RelationshipType.blocked) {
        throw new ForbiddenException('user is blocked');
      }
      switch (relationType) {
        case RelationshipType.sent: {
          if (userRelation == RelationshipType.friend) {
            throw new BadRequestException('User and peer are already friends');
          }
          userRelation = RelationshipType.sent;
          peerRelation = RelationshipType.received;
          this.gatewayService.server.to(userId).emit('relationship-update', {
            peerId: peerId,
            relationType: userRelation,
          });
          this.gatewayService.server.to(peerId).emit('relationship-update', {
            peerId: userId,
            relationType: peerRelation,
          });
          break;
        }
        case RelationshipType.friend: {
          //Friend accept request can only be sent by a user that received an invite
          if (userRelation != RelationshipType.received) {
            throw new BadRequestException(
              'Cannot be friends: no pending friend request',
            );
          }
          userRelation = RelationshipType.friend;
          peerRelation = RelationshipType.friend;
          break;
        }
        case RelationshipType.blocked: {
          userRelation = RelationshipType.blocked;
          break;
        }
        default: {
          console.log('Relationship update: no case matched');
          throw new BadRequestException('Cannot update relationship type');
        }
      }
      if (relation[0] != undefined) {
        relation[0].type = userRelation;
        relation[1].type = peerRelation;
        await this.relationshipRepository.save(relation[0]);
        await this.relationshipRepository.save(relation[1]);
      } else {
        await this.relationshipRepository.save({
          type: userRelation,
          user: user,
          peer: peer,
        });
        await this.relationshipRepository.save({
          type: peerRelation,
          user: peer,
          peer: user,
        });
      }
    }
  }

  async deleteRelation(userId: string, peerId: string): Promise<void> {
    const user: User = await this.userService.findEntity(userId);
    const peer: User = await this.userService.findEntity(peerId);
    const relation = await this.findRelation(user, peer);
    console.log('Relation:', relation);
    await this.relationshipRepository.delete(relation[0]);
    await this.relationshipRepository.delete(relation[1]);
  }
}
