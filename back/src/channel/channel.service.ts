import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { ChannelDTO } from './channel.dto';
import { UsersService } from 'src/user/user.service';
import { ChannelParticipantDTO } from 'src/channelParticipant/channelParticipant.dto';
import { channelParticipantService } from 'src/channelParticipant/channelParticipant.service';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @Inject()
    private userService: UsersService,
    @Inject()
    private participantService: channelParticipantService,
  ) {}

  //How is Channel ID generated automatically if I use DTO?

  async findAll(): Promise<Channel[]> {
    return await this.channelRepository.find();
  }

  async findOne(id: string): Promise<Channel> {
    return await this.channelRepository.findOne(id);
  }

  //Potential error if findOne fails
  async create(data: ChannelDTO, userId: string) {
    const date = new Date();
    const channel = this.channelRepository.create({
      ...data,
      createdAt: date,
      updatedAt: date,
      owner: await this.userService.findOne(userId),
    });
    await this.channelRepository.save(channel);
    const participant = new ChannelParticipantDTO();
    participant.admin = true;
    await this.participantService.create(participant, userId, channel.id);
  }

  //For now, Multiple channels with same name is allowed
  async update(id: string, date: ChannelDTO) {
    const channel = await this.findOne(id);

  }

  async delete(id: string): Promise<void> {
    await this.channelRepository.delete(id);
  }
}
