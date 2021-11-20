import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDTO } from './user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
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

  async create(data: UserDTO) {
    const now = new Date();
    const user = this.usersRepository.create({
      ...data,
      createdAt: now,
      updatedAt: now,
    }); //Not sure if I need to save after a create --> Need to test that
    await this.usersRepository.save(data);
    return user;
  }

  async delete(id: string) {
    const user = this.usersRepository.findOne(id);
    if ((await user).channels.length > 0)
    {
      //delete channels (which in turns deletes corresponding channel participants)
      // --> user needs to Cascade into Channels which needs to Cascade into ChannelParticipants
      // So when we delete a user, the channels it owns are delete

      /*
        2 Solutions:
        a. User cascades in channelParticipant: when a user is deleted, we delete its channelParticipant entries
          -> Before deleting a channel participant entry, we check if the user is the owner of the channel, in which case we delete the channel
            -> Channel Cascades into channelParticipant, so when a channel is deleted, all its participants are deleted as well
        b. User Cascade into Channels which Cascade into ChannelParticipants
          -> When deleting a user we check the channels it owns and we delete them
            -> Upon deletion, channels delete all channel Participants
          -> We then delete all participations from user on other channels (the ones it's not the owner of)
          => User cascade Channel cascade ChannelParticipant
          => User cascade ChannelParticipant 
      */
    }
    await this.usersRepository.delete(id);
  }

  async update(id: string, data: UserDTO) {
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
        throw new NotFoundException('Pseudo already in use!!'); //Need to use an appropriate exception
      }
    }
    for (const prop in data) {
      if (data[prop]) {
        editedUser[prop] = data[prop];
      }
    }
    editedUser.updatedAt = new Date();
    await this.usersRepository.save(editedUser);
  }
}
