import {
  forwardRef,
  ForbiddenException,
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { CreateChannelDTO, UpdateChannelDTO } from './channel.dto';
import { UserService } from 'src/user/user.service';
import { ChannelParticipantService } from 'src/channelParticipant/channelParticipant.service';
import { ChannelType } from './channel.entity';
import { User } from 'src/user/user.entity';
import * as bcrypt from 'bcrypt';
import { ChannelParticipant } from 'src/channelParticipant/channelParticipant.entity';
import { UpdateChannelParticipantDTO } from 'src/channelParticipant/channelParticipant.dto';
import { MessageService } from 'src/message/message.service';
import { Message } from 'src/message/message.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => ChannelParticipantService))
    private participantService: ChannelParticipantService,
    @Inject(MessageService)
    private messageService: MessageService,
  ) {}

  async findAll(): Promise<Channel[]> {
    return await this.channelRepository.find();
  }

  async findOne(channelId: string): Promise<Channel> {
    return await this.channelRepository.findOneOrFail(channelId);
  }

  async findOneDMchannel(channelName: string): Promise<Channel> {
    return await this.channelRepository.findOneOrFail({
      where: {
        name: channelName,
      },
    });
  }

  async findOneParticipant(
    user: User,
    channel: Channel,
  ): Promise<ChannelParticipant> {
    return await this.participantService.findOne(user, channel);
  }

  async findParticipants(
    userId: string,
    channelId: string,
  ): Promise<ChannelParticipant[]> {
    const user = await this.userService.findById(userId);
    const channel = await this.findOne(channelId);
    try {
      await this.participantService.findOne(user, channel);
      return await this.participantService.allChannelParticpants(channel);
    } catch {
      throw new ForbiddenException('Only members can see other members');
    }
  }

  async findMessages(userId: string, channelId: string): Promise<Message[]> {
    const user = await this.userService.findById(userId);
    const channel = await this.findOne(channelId);
    const participant = await this.participantService.findOne(user, channel); // Check if user is a participant
    if (participant.banned) {
      return [];
    }
    return await this.messageService.findChannelMessages(channel);
  }

  async create(userId: string, data: CreateChannelDTO): Promise<void> {
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

  async createDMchannel(
    user1: User,
    user2: User,
    channelName: string,
  ): Promise<Channel> {
    const date = new Date();
    const channelEntity = {
      name: channelName,
      type: ChannelType.private,
      createdAt: date,
      updatedAt: date,
      owner: user1,
      DM: true,
    };
    const channel = await this.channelRepository.save(channelEntity);
    await this.participantService.create(user1, channel);
    await this.participantService.create(user2, channel);
    return channel;
  }

  async addMessage(
    userId: string,
    channelId: string,
    message: string,
    gameInvite?: boolean,
  ) {
    const channel = await this.findOne(channelId);
    const user = await this.userService.findById(userId);
    await this.participantService.findOne(user, channel); // Check if user is a participant
    let invite;
    if (gameInvite) {
      invite = gameInvite;
    } else {
      invite = false;
    }
    await this.messageService.addMessage(channel, user, message, invite);
  }

  //Public Channels: a participant adds himself
  //Private Channels: admins add participants
  //Protected: participant adds himself if he can provide the password
  async addParticipant(
    userId: string,
    participantId: string,
    channelId: string,
    password?: string,
  ) {
    const channel: Channel = await this.findOne(channelId);
    const user: User = await this.userService.findById(userId);
    const participantToCreate: User = await this.userService.findById(
      participantId,
    );
    try {
      await this.participantService.findOne(participantToCreate, channel); // If participant is not found, we can create it, otherwise, we won't create it and will throw
      console.log('Participant already exists!'); // DEBUG
    } catch {
      if (
        await this.isAdditionAllowed(
          user,
          participantToCreate,
          channel,
          password,
        )
      ) {
        await this.participantService.create(participantToCreate, channel);
        return;
      } else {
        console.log('Addition not allowed'); // DEBUG
      }
    }
    throw new BadRequestException('Cannot add participant to channel');
  }

  async isAdditionAllowed(
    userAdding: User,
    userToAdd: User,
    channel: Channel,
    password?: string,
  ): Promise<boolean> {
    switch (channel.type) {
      case ChannelType.public:
        return userAdding.id === userToAdd.id; // Users can add themselves but cannot add others (TBC, might be easier this way)
      case ChannelType.private:
        try {
          return (await this.participantService.findOne(userAdding, channel))
            .admin;
        } catch {
          return false;
        }
      case ChannelType.protected:
        if (password == undefined) {
          return false;
        }
        if (userAdding.id === userToAdd.id) {
          return await this.verifyPassword(password, channel.password);
        } else {
          return false;
        }
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

  //Update Admin, Ban and Mute status
  async updateParticipant(
    userId: string,
    participantId: string,
    channelId: string,
    updateData: UpdateChannelParticipantDTO,
  ): Promise<void> {
    const channel: Channel = await this.findOne(channelId);
    const user: User = await this.userService.findById(userId);
    const participantToUpdate: User = await this.userService.findById(
      participantId,
    );
    let participationUpdating: ChannelParticipant;
    let participationToUpdate: ChannelParticipant;
    try {
      participationUpdating = await this.participantService.findOne(
        user,
        channel,
      );
      participationToUpdate = await this.participantService.findOne(
        participantToUpdate,
        channel,
      );
    } catch {
      console.log('Cannot update channel member: not found');
      throw new NotFoundException('user not found');
    }
    if (
      this.isUpdateAllowed(
        participationUpdating,
        participationToUpdate,
        channel,
        updateData,
      )
    ) {
      await this.participantService.update(participationToUpdate, updateData);
    } else {
      throw new BadRequestException('Cannot update channel member');
    }
  }

  async removeMute(participant: ChannelParticipant) {
    await this.participantService.update(participant, {
      muted: false,
      muteEnd: null,
    });
  }

  isUpdateAllowed(
    participationUpdating: ChannelParticipant,
    participationToUpdate: ChannelParticipant,
    channel: Channel,
    updateData: UpdateChannelParticipantDTO,
  ): boolean {
    // Only admins can update members
    if (!participationUpdating.admin) {
      console.log('only admin can update');
      return false;
    }
    const isOwner = participationUpdating.user.id == channel.owner.id;
    // Only owner can update admins
    if (participationToUpdate.admin && !isOwner) {
      console.log('only owner can update admin');
      return false;
    }
    // Only owner can promote to admin
    if (updateData.admin && !isOwner) {
      console.log('only owner can promote to admin');
      return false;
    }
    // Cannot update MuteEndDate if user is not muted
    if (updateData.muted == false && updateData.muteEnd != undefined) {
      console.log('user is not muted but date is set');
      return false;
    }
    if (
      participationToUpdate.muted == false &&
      updateData.muted == undefined &&
      updateData.muteEnd != undefined
    ) {
      console.log('user is not muted but date is set');
      return false;
    }
    return true;
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
    if (user.id === channel.owner.id) {
      await this.channelRepository.delete(channelId);
    } else {
      await this.participantService.deleteOne(user, channel);
    }
  }
}
