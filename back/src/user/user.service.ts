import {
  BadRequestException,
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
import { ChannelParticipantService } from 'src/channelParticipant/channelParticipant.service';
import { Channel } from 'src/channel/channel.entity';
import { MatchHistoryService } from 'src/matchHistory/matchHistory.service';
import { MatchHistoryDTO } from 'src/matchHistory/matchHistory.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => MatchHistoryService))
    private matchService: MatchHistoryService,
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
    const user = await this.findById(userId);
    const matches = await this.matchService.findUserMatches(user);
    return matches.map((match) => new MatchHistoryDTO(match));
  }

  /*
  Create the user and doesn't return anything
  */
  async create(data: CreateUserDTO): Promise<void> {
    let admin = false;
    if ((await this.userRepository.count()) == 0) {
      admin = true;
    }
    const now = new Date();
    await this.userRepository.save({
      ...data,
      admin: admin,
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
      if (data[prop] !== undefined && prop !== 'admin' && prop !== 'ban') {
        editedUser[prop] = data[prop];
      }
    }
    editedUser.updatedAt = new Date();
    await this.userRepository.save(editedUser);
  }

  async adminUpdate(adminId: string, userId: string, ban: boolean) {
    const admin = await this.findById(adminId);
    if (!admin.admin) {
      throw new ForbiddenException('User is not admin');
    }
    if (adminId === userId) {
      throw new BadRequestException();
    }
    const user = await this.findById(userId);
    if (!user.admin) {
      user.banned = ban;
    }
    await this.userRepository.save(user);
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

  async gameOver(
    userId: string,
    peerId: string,
    scoreUser: number,
    scorePeer: number,
  ): Promise<void> {
    const user = await this.findById(userId);
    const peer = await this.findById(peerId);
    if (scoreUser > scorePeer) {
      user.victories++;
      peer.defeats++;
    } else {
      peer.victories++;
      user.defeats++;
    }
    await this.userRepository.save(user);
    await this.userRepository.save(peer);
    await this.matchService.add(user, peer, scoreUser, scorePeer);
  }

  async turnOnTwoFactorAuthentication(userId: number) {
    return this.userRepository.update(userId, {
      isTwoFactorAuthenticationEnabled: true,
    });
  }

  find_avatar() {
    const avatars: Array<string> = [
      './avatars/ours/Claudius.png',
      './avatars/ours/Azur.png',
      './avatars/ours/Corgi.png',
      './avatars/ours/Selen.png',
      './avatars/ours/Azur.png',
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
