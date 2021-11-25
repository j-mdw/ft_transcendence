import { forwardRef, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { CreateChannelDTO, UpdateChannelDTO } from './channel.dto';
import { UserService } from 'src/user/user.service';
// import { ChannelParticipantDTO } from 'src/channelParticipant/channelParticipant.dto';
// import { ChannelParticipantService } from 'src/channelParticipant/channelParticipant.service';
import { ChannelType } from './channel.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    // @Inject(forwardRef(() => ChannelParticipantService))
    // private participantService: ChannelParticipantService,
  ) {}

  async findAll(): Promise<Channel[]> {
    return await this.channelRepository.find();
  }

  async findOne(id: string): Promise<Channel> {
    return await this.channelRepository.findOne(id);
  }

  //Potential error if findOne fails
  async create(userId: string, data: CreateChannelDTO) {
    if (data.type == ChannelType.protected && data.password == null) {
      throw new ForbiddenException(
        'channel of type password must have a password',
      );
    }
    const date = new Date();
    // const channel = 
    this.channelRepository.save({
      ...data,
      createdAt: date,
      updatedAt: date,
      owner: await this.userService.findOne(userId),
    });
    // const participant = new ChannelParticipantDTO();
    // participant.admin = true;
    // const channelId = (await channel).id;
    // await this.participantService.create(participant, userId, channelId);
  }

  /*
  For now, Multiple channels with same name is allowed
  Channel can only be updated by the owner
  Check if the type of the channel is 'password', and if so, if the password is null, throw an exception
  */
  async update(userId: string, channelId: string, data: UpdateChannelDTO) {
    const channel = await this.findOne(channelId);
    if (!(channel.owner.id == userId)) {
      throw new ForbiddenException();
    }
    for (const prop in data) {
      if (data[prop]) {
        channel[prop] = data[prop];
      }
    }
    if (channel.type != ChannelType.protected) {
      channel.password = null;
    } else if (channel.password == null) {
      throw new ForbiddenException(
        'channel of type password must have a password',
      );
    }
    await this.channelRepository.save(channel);
  }

  async delete(userId: string, channelId: string): Promise<void> {
    const channel = await this.findOne(channelId);
    if (!(channel.owner.id == userId)) {
      throw new ForbiddenException();
    }
    // const participants = channel.participants;
    // this.participantService.deleteChannelParticipants(participants);
    await this.channelRepository.delete(channelId);
  }

  async deleteChannels(userId: string, channels: Channel[]) {
    for (const channel of channels) {
      await this.delete(userId, channel.id); //Could optimise by passing channel instead of id to avoid additional lookup
    }
  }
}
