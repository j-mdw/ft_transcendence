import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelService } from 'src/channel/channel.service';
import { UsersService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { ChannelParticipantDTO } from './channelParticipant.dto';
import { ChannelParticipant } from './channelParticipant.entity';

@Injectable()
export class channelParticipantService {
  constructor(
    @InjectRepository(ChannelParticipant)
    private participantRepository: Repository<ChannelParticipant>,
    @Inject()
    private userService: UsersService,
    @Inject()
    private channelService: ChannelService,
  ) {}

  async create(
    participant: ChannelParticipantDTO,
    userId: string,
    channelId: string,
  ) {
    const channelUser = await this.userService.findOne(userId);
    const channel = await this.channelService.findOne(channelId);
    const participantEntity = await this.participantRepository.create({
      ...participant,
      user: channelUser,
      channel: channel,
    });
    await this.participantRepository.save(participantEntity);
  }
}
