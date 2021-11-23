import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDTO, UpdateUserDTO } from './user.dto';
import { ChannelService } from 'src/channel/channel.service';
import { ChannelParticipantService } from 'src/channelParticipant/channelParticipant.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => ChannelService))
    private channelService: ChannelService,
    @Inject(forwardRef(() => ChannelParticipantService))
    private participantService: ChannelParticipantService,
  ) {}

  async getUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    return await this.usersRepository.findOne(id);
  }

  async findEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async create(data: UserDTO): Promise<User> {
    const now = new Date();
    return await this.usersRepository.save({
      ...data,
      createdAt: now,
      updatedAt: now,
    });
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    const editedUser = await this.usersRepository.findOne(id);
    if (!editedUser) {
      throw new NotFoundException('User is not found');
    }
    if (data.pseudo) {
      const userPseudo = await this.usersRepository.findOne({
        where: {
          pseudo: data.pseudo,
        },
      });
      if (userPseudo) {
        throw new NotFoundException('Pseudo already in use!!'); //Need to use an appropriate exception ; assumes data passed as agrument is only the data that needs to be updated
      }
    }
    for (const prop in data) {
      if (data[prop]) {
        editedUser[prop] = data[prop];
      }
    }
    editedUser.updatedAt = new Date();
    return await this.usersRepository.save(editedUser);
  }

  /*
  -> When deleting a user we check the channels it owns and we delete them
    -> When deleted, channels delete all channel Participants
  -> We then delete all participations from user on other channels (the ones it's not the owner of)
  */
  async delete(id: string) {
    const user = await this.usersRepository.findOne(id);
    await this.channelService.deleteChannels(user.channels);
    await this.participantService.deleteChannelParticipants(
      user.channelsParticipants,
    );
    await this.usersRepository.delete(id);
  }
}
