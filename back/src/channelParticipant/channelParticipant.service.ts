import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelService } from 'src/channel/channel.service';
import { Repository } from 'typeorm';
// import { ChannelParticipantDTO } from './channelParticipant.dto';
import { ChannelParticipant } from './channelParticipant.entity';
import { Channel } from 'src/channel/channel.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class ChannelParticipantService {
  constructor(
    @InjectRepository(ChannelParticipant)
    private participantRepository: Repository<ChannelParticipant>,
    // @Inject(forwardRef(() => UserService))
    // private userService: UserService,
    @Inject(forwardRef(() => ChannelService))
    private channelService: ChannelService,
  ) {}

  // async find(): Promise<ChannelParticipant[]> {
  //   return await this.participantRepository.find();
  // }

  // async findOne(
  //   userId: string,
  //   channelId: string,
  // ): Promise<ChannelParticipant> {
  //   return await this.participantRepository.findOne({
  //     where: {
  //       user: userId,
  //       channel: channelId,
  //     },
  //   });
  // }

  async create(
    user: User,
    channel: Channel,
    admin?: boolean,
  ): Promise<ChannelParticipant> {
    const entity = new ChannelParticipant();
    entity.user = user;
    entity.channel = channel;
    if (admin != undefined) {
      entity.admin = admin;
    }
    return await this.participantRepository.save(entity);
  }

  // async update(
  //   to_update: UpdateChannelParticipantDTO,
  //   userId: string,
  //   channelId: string,
  // ): Promise<ChannelParticipant> {
  //   const participant = await this.findOne(userId, channelId);
  //   for (const prop in to_update) {
  //     if (to_update[prop]) {
  //       participant[prop] = to_update[prop];
  //     }
  //   }
  //   return await this.participantRepository.save(participant);
  // }

  // async delete(userId: string, channelId: string) {
  //   const participant = await this.findOne(userId, channelId);
  //   this.participantRepository.remove(participant);
  // }

  // async deleteChannelParticipants(participants: ChannelParticipant[]) {
  //   await this.participantRepository.remove(participants);
  // }

  // async deleteUserParticipations()
}
