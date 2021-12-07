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
import { UserDTO, CreateUserDTO } from './user.dto';
import { ChannelService } from 'src/channel/channel.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => ChannelService))
    private channelService: ChannelService,
  ) {}

  async getUsers(): Promise<UserDTO[]> {
    return await this.usersRepository
      .find()
      .then((users) => users.map((user) => new UserDTO(user)));
  }

  async findOne(id: string): Promise<UserDTO> {
    return await this.usersRepository
      .findOne(id)
      .then((user) => new UserDTO(user));
  }

  async getEntity(id: string): Promise<User> {
    return await this.usersRepository.findOne(id);
  }

  async isRegistered(email: string): Promise<boolean> {
    if (
      await this.usersRepository.find({
        where: {
          email: email,
        },
      })
    )
      return true;
    return false;
  }

  async findEmail(email: string): Promise<UserDTO> {
    const user = await this.usersRepository.findOne({
      where: {
        email: email,
      },
    });
    if (user) {
      return new UserDTO(user);
    } else {
      throw new NotFoundException('user not found');
    }
  }

  /*
  Create the user and doesn't return anything
*/
  async create(data: CreateUserDTO): Promise<void> {
    const now = new Date();
    await this.usersRepository.save({
      ...data,
      createdAt: now,
      updatedAt: now,
    });
    console.log('user created: ', data);
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: string) {
    return this.usersRepository.update(userId, {
      twoFactorAuthenticationSecret: secret,
    });
  }

  /*
  Update the user and doesn't return anything
  Throw if id passed as param is invalid or if trying to use a pseudo already in use
*/
  async update(id: string, data: Partial<Omit<UserDTO, 'id'>>): Promise<void> {
    const editedUser = await this.usersRepository.findOne(id).catch(() => {
      throw new ForbiddenException('Invalid user ID');
    });
    if (data.pseudo) {
      await this.usersRepository
        .findOne({
          where: {
            pseudo: data.pseudo,
          },
        })
        .catch(() => {
          throw new ConflictException('Pseudo already in use!');
        });
    }
    for (const prop in data) {
      if (data[prop]) {
        editedUser[prop] = data[prop];
      }
    }
    editedUser.updatedAt = new Date();
    await this.usersRepository.save(editedUser);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.usersRepository.delete(id);
  }

  async update_avatar(id: string, path: string) {
    const editedUser = await this.usersRepository.findOne(id);
    console.log(editedUser);
    if (!editedUser) {
      throw new NotFoundException('User is not found');
    }
    editedUser.avatarPath = path;
    await this.usersRepository.save(editedUser);
    console.log(editedUser);
    return editedUser;
  }

  async turnOnTwoFactorAuthentication(userId: number) {
    return this.usersRepository.update(userId, {
      isTwoFactorAuthenticationEnabled: true,
    });
  }

  find_avatar() {
    const avatars: Array<string> = [
      './avatars/ours/pepin.jpg',
      './avatars/ours/pepin1.jpg',
      './avatars/ours/pepin2.jpg',
      './avatars/ours/pepin3.jpg',
      './avatars/ours/pepin4.jpg',
    ];

    const my_avatar = avatars[Math.floor(Math.random() * avatars.length)];
    console.log(my_avatar);
    return my_avatar;
  }
}
