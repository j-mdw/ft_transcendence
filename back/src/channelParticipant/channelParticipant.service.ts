import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelParticipant } from './channelParticipant.entity';
import { Channel } from 'src/channel/channel.entity';
import { User } from 'src/user/user.entity';
import { UpdateChannelParticipantDTO } from './channelParticipant.dto';

@Injectable()
export class ChannelParticipantService {
  constructor(
    @InjectRepository(ChannelParticipant)
    private participantRepository: Repository<ChannelParticipant>,
  ) {}

  async allChannelParticpants(channel: Channel): Promise<ChannelParticipant[]> {
    return await this.participantRepository.find({
      where: {
        channel: channel,
      },
    });
  }

  async findUserParticipations(user: User): Promise<ChannelParticipant[]> {
    return await this.participantRepository.find({
      where: {
        user: user,
      },
    });
  }

  async findOne(user: User, channel: Channel): Promise<ChannelParticipant> {
    return await this.participantRepository.findOneOrFail({
      where: {
        user: user,
        channel: channel,
      },
    });
  }

  //If the user is already a channelParticipant, this function does nothing
  async create(user: User, channel: Channel, admin?: boolean): Promise<void> {
    const entity = new ChannelParticipant();
    entity.user = user;
    entity.channel = channel;
    if (admin != undefined) {
      entity.admin = admin;
    }
    await this.participantRepository.save(entity);
  }

  async update(
    participant: ChannelParticipant,
    updateData: UpdateChannelParticipantDTO,
  ) {
    for (const prop in updateData) {
      if (updateData[prop] !== undefined && updateData[prop] !== null) {
        participant[prop] = updateData[prop];
      }
    }
    if (participant.muted == false) {
      participant.muteEnd = null;
    }
    await this.participantRepository.save(participant);
  }

  async deleteOne(user: User, channel: Channel) {
    const participant = await this.findOne(user, channel);
    await this.participantRepository.delete(participant);
  }
}
