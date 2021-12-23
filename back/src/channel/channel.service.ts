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
import { ChannelParticipantService } from 'src/channelParticipant/channelParticipant.service';
import { ChannelType } from './channel.entity';
import { User } from 'src/user/user.entity';
import { UserDTO } from 'src/user/user.dto';
import * as bcrypt from 'bcrypt';

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

  async findAll(): Promise<Channel[]> {
    //Should probably disable this endpoint --> Only possible to get list of public/protected channels
    return await this.channelRepository.find();
  }

  async findOne(id: string): Promise<Channel> {
    return await this.channelRepository.findOneOrFail(id);
  }

  async create(userId: string, data: CreateChannelDTO) {
    const user = await this.userService.findById(userId);
    if (data.type == ChannelType.protected) {
      if (!data.password) {
        throw new BadRequestException(
          'channel of type protected must have a password',
        );
      } else {
        const saltOrRounds = 10;
        data.password = await bcrypt.hash(data.password, saltOrRounds);
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

  //Public Channels: a participant adds himself
  //Private Channels: admins add users
  //Protected: participant adds himself if he can provide the password
  async addParticipant(
    userId: string,
    participantId: string,
    channelId: string,
    password?: string,
  ) {
    const channel: Channel = await this.findOne(channelId);
    const user: User = await this.userService.findById(userId);
    await this.participantService.findOne(user, channel); //If user cannot be found, 404 will be thrown
    const participantToCreate: User = await this.userService.findById(
      participantId,
    );
    try {
      await this.participantService.findOne(participantToCreate, channel);
    } catch {
      if (
        this.isAdditionAllowed(user, participantToCreate, channel, password)
      ) {
        await this.participantService.create(participantToCreate, channel);
      }
      return;
    }
    throw new BadRequestException('Already channel participant');
  }

  async isAdditionAllowed(
    userAdding: User,
    userToAdd: User,
    channel: Channel,
    password?: string,
  ): Promise<boolean> {
    switch (channel.type) {
      case ChannelType.public:
        return userAdding.id === userToAdd.id; // Users can add themselves but cannot add others (TBC, might be easier
      case ChannelType.private:
        return (await this.participantService.findOne(userAdding, channel))
          .admin;
      case ChannelType.protected:
        return await this.verifyPassword(password, channel.password);
      default:
        return false;
    }
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
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
    const currentChannel = await this.findOne(channelId);
    if (currentChannel.owner.id != userId) {
      throw new ForbiddenException('Only channel owner can delete channel');
    }
    await this.channelRepository.delete(channelId);
  }

  async deleteParticipant(userId: string, channelId: string): Promise<void> {
    const user = await this.userService.findById(userId);
    const channel = await this.findOne(channelId);
    await this.participantService.deleteOne(user, channel);
  }
}
