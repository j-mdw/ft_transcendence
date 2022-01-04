import {
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDTO, UpdateUserDTO } from './user.dto';
import { ChannelService } from 'src/channel/channel.service';
import { ChannelParticipantService } from 'src/channelParticipant/channelParticipant.service';
import { Channel } from 'src/channel/channel.entity';
import { MatchHistory } from 'src/matchHistory/matchHistory.entity';
import { MatchHistoryService } from 'src/matchHistory/matchHistory.service';
import { MatchHistoryDTO } from 'src/matchHistory/matchHistory.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    // @Inject(forwardRef(() => ChannelService))
    // private channelService: ChannelService,
    @Inject(forwardRef(() => MatchHistoryService))
    private matchesService: MatchHistoryService,
    @Inject(forwardRef(() => ChannelParticipantService))
    private channelParticipantService: ChannelParticipantService,
  ) {}

  async getUsers(): Promise<User[]> {
    const users: User[] = await this.userRepository.find();
    if (users) {
      return users;
    } else {
      throw new NotFoundException('No users in DB');
    }
  }

  async findById(id: string): Promise<User> {
    return await this.userRepository.findOneOrFail(id);
  }

  async isRegistered(email: string): Promise<boolean> {
    if (
      await this.userRepository.findOne({
        where: {
          email: email,
        },
      })
    )
      return true;
    return false;
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneOrFail({
      where: {
        email: email,
      },
    });
  }

  async findByPseudo(pseudo: string): Promise<User> {
    return await this.userRepository.findOneOrFail({
      where: {
        pseudo: pseudo,
      },
    });
  }

  async getMatches(userId: string): Promise<MatchHistoryDTO[]> {
    const user = await this.userRepository.findOneOrFail({
      where: {
        id: userId,
      },
    });
    const matches = await this.matchesService.findUserMatches(user);
    return matches.map((match) => new MatchHistoryDTO(match));
  }

  /*
  Create the user and doesn't return anything
  */
  async create(data: CreateUserDTO): Promise<void> {
    const now = new Date();
    await this.userRepository.save({
      ...data,
      createdAt: now,
      updatedAt: now,
    });
    console.log('user created: ', data);
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: string) {
    return this.userRepository.update(userId, {
      twoFactorAuthenticationSecret: secret,
    });
  }

  /*
  Update the user and doesn't return anything
  Throw if id passed as param is invalid or if trying to use a pseudo already in use
*/
  async update(id: string, data: UpdateUserDTO): Promise<void> {
    console.log('Data for PATCH update:', data);
    let editedUser = null;
    try {
      editedUser = await this.findById(id);
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('Cannot update - User not in DB');
    }
    if (data.pseudo) {
      let isUsed = false;
      try {
        await this.findByPseudo(data.pseudo);
        isUsed = true;
        console.log('Pseudo already in use!');
      } catch {
        isUsed = false;
        console.log('Pseudo:', data.pseudo, 'is available');
      }
      if (isUsed == true) {
        throw new ConflictException('Pseudo already in use!');
      }
    }
    for (const prop in data) {
      if (data[prop] !== undefined) {
        editedUser[prop] = data[prop];
      }
    }
    editedUser.updatedAt = new Date();
    await this.userRepository.save(editedUser);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }

  async update_avatar(id: string, path: string) {
    const editedUser = await this.userRepository.findOne(id);
    console.log(editedUser);
    if (!editedUser) {
      throw new NotFoundException('User is not found');
    }
    editedUser.avatarPath = path;
    await this.userRepository.save(editedUser);
    console.log(editedUser);
    return editedUser;
  }

  async turnOnTwoFactorAuthentication(userId: number) {
    return this.userRepository.update(userId, {
      isTwoFactorAuthenticationEnabled: true,
    });
  }

  find_avatar() {
    const avatars: Array<string> = [
      './avatars/ours/pepin.jpg',
      // './avatars/ours/pepin1.jpg',
      './avatars/ours/pepin2.jpg',
      './avatars/ours/pepin3.jpg',
      // './avatars/ours/pepin4.jpg',
    ];

    const my_avatar = avatars[Math.floor(Math.random() * avatars.length)];
    console.log(my_avatar);
    return my_avatar;
  }

  async findChannels(userId: string): Promise<Channel[]> {
    const user = await this.findById(userId);
    return (
      await this.channelParticipantService.findUserParticipations(user)
    ).map((participation) => participation.channel);
  }
}
