import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelService } from 'src/channel/channel.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import {
  ChannelParticipantDTO,
  UpdateChannelParticipantDTO,
} from './channelParticipant.dto';
import { ChannelParticipant } from './channelParticipant.entity';

@Injectable()
export class channelParticipantService {
  constructor(
    @InjectRepository(ChannelParticipant)
    private participantRepository: Repository<ChannelParticipant>,
    @Inject()
    private userService: UserService,
    @Inject()
    private channelService: ChannelService,
  ) {}

  async find(): Promise<ChannelParticipant[]> {
    return await this.participantRepository.find();
  }

  async findOne(
    userId: string,
    channelId: string,
  ): Promise<ChannelParticipant> {
    return await this.participantRepository.findOne({
      where: {
        user: userId,
        channel: channelId,
      },
    });
  }

  async create(
    participant: ChannelParticipantDTO,
    userId: string,
    channelId: string,
  ): Promise<ChannelParticipant> {
    const channelUser = await this.userService.findOne(userId);
    const channel = await this.channelService.findOne(channelId);
    return await this.participantRepository.save({
      ...participant,
      user: channelUser,
      channel: channel,
    });
  }

  async update(
    to_update: UpdateChannelParticipantDTO,
    userId: string,
    channelId: string,
  ): Promise<ChannelParticipant> {
    const participant = await this.findOne(userId, channelId);
    for (const prop in to_update) {
      if (to_update[prop]) {
        participant[prop] = to_update[prop];
      }
    }
    return await this.participantRepository.save(participant);
  }

  async delete(userId: string, channelId: string) {
    const participant = await this.findOne(userId, channelId);
    this.participantRepository.remove(participant);
  }

  async deleteChannelParticipants(participants: ChannelParticipant[]) {
    await this.participantRepository.remove(participants);
  }

  // async deleteUserParticipations()
}
