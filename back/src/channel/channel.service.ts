import {
  forwardRef,
  ForbiddenException,
  Inject,
  Injectable,
  BadRequestException,
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
    return (await this.channelRepository.find()).map(
      (channel) => new ChannelDTO(channel),
    );
  }

  async findOne(id: string): Promise<ChannelDTO> {
    return new ChannelDTO(await this.channelRepository.findOneOrFail(id));
  }

  async findEntity(id: string): Promise<Channel> {
    return await this.channelRepository.findOneOrFail(id);
  }

  async create(userId: string, data: CreateChannelDTO) {
    const user = await this.userService.findEntity(userId);
    if (data.type == ChannelType.protected) {
      if (!data.password) {
        throw new BadRequestException(
          'channel of type protected must have a password',
        );
      }
    } else {
      data.password = null;
    }
    const date = new Date();
    const channelEntity = {
      ...data,
      createdAt: date,
      updatedAt: date,
      owner: user,
    };
    const channel = await this.channelRepository.save(channelEntity);
    await this.participantService.create(user, channel, true);
  }

  /*
  For now, Multiple channels with same name are allowed
  Channel can only be updated by the owner (not functional yet)
  If the channel is protected, a password must be provided, othwerise, a BadRequest exception is thrown
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
    if (data.type == ChannelType.protected) {
      if (data.password != undefined) {
        channel.password = data.password;
      } else {
        throw new BadRequestException(
          'No password provided for protected channel',
        );
      }
    } else {
      channel.password = null;
    }
    channel.type = data.type;
    await this.channelRepository.save(channel);
  }

  async delete(userId: string, channelId: string): Promise<void> {
    const currentChannel = await this.findEntity(channelId);
    if (currentChannel.owner.id != userId) {
      throw new ForbiddenException('Only channel owner can delete channel');
    }
    await this.channelRepository.delete(channelId);
  }
}
