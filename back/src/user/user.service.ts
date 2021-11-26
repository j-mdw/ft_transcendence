import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDTO, UpdateUserDTO, CreateUserDTO } from './user.dto';
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
    return (await this.usersRepository.find()).map((user) => new UserDTO(user));
  }

  async findOne(id: string): Promise<UserDTO> {
    return new UserDTO(await this.usersRepository.findOne(id));
  }

  async isRegistered(email: string): Promise<any> {
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
    return new UserDTO(
      await this.usersRepository.findOne({
        where: {
          email: email,
        },
      }),
    );
  }
  /*
  Create the user and doesn't return anything
*/
  async create(data: CreateUserDTO): Promise<any> {
    const now = new Date();
    await this.usersRepository.save({
      ...data,
      createdAt: now,
      updatedAt: now,
    });
  }

  /*
  Update the user and doesn't return anything
*/
  async update(id: string, data: UpdateUserDTO): Promise<any> {
    console.log('update user called: ', data);
    const editedUser = await this.usersRepository.findOne(id);
    if (!editedUser) {
      throw new NotFoundException('Invalid user ID');
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
