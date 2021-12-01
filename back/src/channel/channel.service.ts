import {
  forwardRef,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { ChannelDTO, CreateChannelDTO, UpdateChannelDTO } from './channel.dto';
import { UserService } from 'src/user/user.service';
// import { ChannelParticipantDTO } from 'src/channelParticipant/channelParticipant.dto';
import { ChannelParticipantService } from 'src/channelParticipant/channelParticipant.service';
import { ChannelType } from './channel.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => ChannelParticipantService))
    private participantService: ChannelParticipantService,
  ) {}

  async findAll(): Promise<ChannelDTO[]> {
    return await this.channelRepository
      .find()
      .then((channels) => channels.map((channel) => new ChannelDTO(channel)));
  }

  async findOne(id: string): Promise<ChannelDTO> {
    return await this.channelRepository
      .findOne(id)
      .then((channel) => new ChannelDTO(channel));
  }

  //Potential error if findOne fails
  async create(userId: string, data: CreateChannelDTO) {
    const user = await this.userService.getEntity(userId);
    if (data.type == ChannelType.protected && !data.password) {
      throw new ForbiddenException(
        'channel of type password must have a password',
      );
    }
    const date = new Date();
    await this.channelRepository
      .save({
        ...data,
        createdAt: date,
        updatedAt: date,
        owner: user,
      })
      .then((channel) => this.participantService.create(user, channel));

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
  async update(
    userId: string,
    channelId: string,
    data: UpdateChannelDTO,
  ): Promise<void> {
    const channel = await this.channelRepository.findOneOrFail(channelId);
    if (channel.owner.id != userId) {
      throw new ForbiddenException('Only channel owner can update');
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
        'channel of type protected must have a password',
      );
    }
    await this.channelRepository.save(channel);
  }

  // For now not checking if user is the owner or not due to issues with retrieving owner id
  async delete(userId: string, channelId: string): Promise<void> {
    const currentChannel = await this.channelRepository.findOneOrFail(
      channelId,
    );
    if (currentChannel.owner.id != userId) {
      throw new ForbiddenException('Only channel owner can delete channel');
    }
    // const participants = channel.participants;
    // this.participantService.deleteChannelParticipants(participants);
    await this.channelRepository.delete(channelId);
  }
}
