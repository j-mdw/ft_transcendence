import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { ChannelParticipantDTO } from './channelParticipant.dto';
import { ChannelParticipant } from './channelParticipant.entity';
import { Channel } from 'src/channel/channel.entity';
import { User } from 'src/user/user.entity';
import { UpdateChannelParticipantDTO } from './channelParticipant.dto';

@Injectable()
export class ChannelParticipantService {
  constructor(
    @InjectRepository(ChannelParticipant)
    private participantRepository: Repository<ChannelParticipant>, // @Inject(forwardRef(() => UserService)) // private userService: UserService, // @Inject(forwardRef(() => ChannelService)) // private channelService: ChannelService,
  ) {}

  async allChannelParticpants(channel: Channel): Promise<ChannelParticipant[]> {
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

  async update(
    participant: ChannelParticipant,
    updateData: UpdateChannelParticipantDTO,
  ) {
    if (participant.muted == true && updateData.muted == false) {
      updateData.muteEnd = null;
    }
    for (const prop in updateData) {
      if (updateData[prop] != undefined) {
        participant[prop] = updateData[prop];
      }
    }
    await this.participantRepository.save(participant);
  }

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

/* Channel participant testing:
  - Peer (admin) add participant to public channel => FAIL
  - Peer (non-admin) add participant to public channel => FAIL
  - Participant add self to public channel => SUCCESS

  - Peer (admin) add participant to private channel => SUCCESS
  - Peer (non-admin) add participant to private channel => FAIL
  - Participant add self to private channel => FAIL

  - Peer (admin) add participant to protected channel with correct PW => FAIL
  - Peer (admin) add participant to protected channel with bad PW => FAIL
  - Peer (non-admin) add participant to protected channel => FAIL
  - Participant add self to private channel with correct PW => SUCCESS
  - Participant add self to private channel with bad PW => FAIL

  All channel types:
  - GET channel Participants from channel user is not a participant => FAIL
  - Participant add self to channel while already in channel => FAIL
  - Peer (admin or not) delete user from channel => FAIL
  - Participant delete self from channel => SUCCESS
  - Participant delete self from channel it's not a part of => FAIL

  Participant update (all channels):
  Format:
  - Bad date format for muteEnd
  - Bad date (prior to current date)
  - All to null
  - Set muted to false but provide EndDate
  Admin:
  - Owner make participant admin => SUCCESS
  - Non-owner make participant admin => FAIL
  - Owner remove admin role => SUCESS
  - Non-owner remove admin role => FAIL
  Ban:
  - Admin make participant ban => SUCCESS
  - Non-admin make participant ban => FAIL
  - Admin remove ban => SUCESS
  - Non-admin remove ban => FAIL 
  Mute:
  - Admin make participant mute (no end-date) => SUCCESS
  - Non-admin mute participant (no end-date) => FAIL
  - Admin unmute => SUCCESS
  - Non-admin remove ban => FAIL
  - Admin mute participant w/ end-date => SUCCESS
  - Non-admin mute participant w/ end-date => FAIL
  Combined:
  - Onwer promote participant to Admin and ban and/or mute at the same time => FAIL
  Unhandled for now

*/
