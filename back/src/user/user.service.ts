import {
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDTO, CreateUserDTO } from './user.dto';
import { ChannelService } from 'src/channel/channel.service';
import { CreateChannelDTO } from 'src/channel/channel.dto';
// import { ChannelParticipantService } from 'src/channelParticipant/channelParticipant.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => ChannelService))
    private channelService: ChannelService, // @Inject(forwardRef(() => ChannelParticipantService)) // private participantService: ChannelParticipantService,
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
    return await this.usersRepository
      .findOne({
        where: {
          email: email,
        },
      })
      .then((user) => {
        console.log(user);
        if (user) {
          return new UserDTO(user);
        }
        throw new NotFoundException('user not found');
      });
    // const user = await this.usersRepository.findOneOrFail({
    //   where: {
    //     email: email,
    //   },
    // });
    // console.log('find email return: ', user);
    // return new UserDTO(user);
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

  /*
  Update the user and doesn't return anything
*/
  async update(id: string, data: Partial<Omit<UserDTO, 'id'>>): Promise<void> {
    console.log('update user called: ', data);

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
          throw new ConflictException('Pseudo already in use!!'); //Need to use an appropriate exception ; assumes data passed as agrument is only the data that needs to be updated
        });
    }
    for (const prop in data) {
      if (data[prop]) {
        editedUser[prop] = data[prop];
      }
      console.log('updated info: ', editedUser);
    }
    editedUser.updatedAt = new Date();
    await this.usersRepository.save(editedUser);
  }

  /*
  -> When deleting a user we check the channels it owns and we delete them
    -> When deleted, channels delete all channel Participants
  -> We then delete all participations from user on other channels (the ones it's not the owner of)
  */
  // async delete(id: string) {
  //   const user = await this.usersRepository.findOne(id);
  //   await this.channelService.deleteChannels(id, user.);
  // await this.participantService.deleteChannelParticipants(
  //   user.channelsParticipants,
  // );
  // await this.usersRepository.delete(id);
  // }
}
