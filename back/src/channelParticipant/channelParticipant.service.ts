import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { ChannelParticipantDTO } from './channelParticipant.dto';
import { ChannelParticipant } from './channelParticipant.entity';
import { Channel } from 'src/channel/channel.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class ChannelParticipantService {
  constructor(
    @InjectRepository(ChannelParticipant)
    private participantRepository: Repository<ChannelParticipant>, // @Inject(forwardRef(() => UserService)) // private userService: UserService, // @Inject(forwardRef(() => ChannelService)) // private channelService: ChannelService,
  ) {}

  async allChannelParticpants(
    channel: Channel,
  ): Promise<ChannelParticipant[]> {
    return await this.participantRepository.find({
      where: {
        channel: channel,
      },
    });
  }

  async findUserParticipations(user: User): Promise<ChannelParticipant[]> {
    return await this.participantRepository.find({
      where: {
        user: user,
      },
    });
  }

  async findOne(user: User, channel: Channel): Promise<ChannelParticipant> {
    return await this.participantRepository.findOneOrFail({
      where: {
        user: user,
        channel: channel,
      },
    });
  }

  //If the user is already a channelParticipant, this function does nothing
  async create(user: User, channel: Channel, admin?: boolean): Promise<void> {
    const entity = new ChannelParticipant();
    entity.user = user;
    entity.channel = channel;
    if (admin != undefined) {
      entity.admin = admin;
    }
    await this.participantRepository.save(entity);
  }

  // async update(
  //   to_update: UpdateChannelParticipantDTO,
  //   userId: string,
  //   channelId: string,
  // ): Promise<ChannelParticipant> {
  //   const participant = await this.findOne(userId, channelId);
  //   for (const prop in to_update) {
  //     if (to_update[prop]) {
  //       participant[prop] = to_update[prop];
  //     }
  //   }
  //   return await this.participantRepository.save(participant);
  // }

  // async delete(userId: string, channelId: string) {
  //   const participant = await this.findOne(userId, channelId);
  //   this.participantRepository.remove(participant);
  // }

  // async deleteChannelParticipants(participants: ChannelParticipant[]) {
  //   await this.participantRepository.remove(participants);
  // }

  async deleteOne(user: User, channel: Channel) {
    const participant = await this.findOne(user, channel);
    await this.participantRepository.delete(participant);
  }
}
