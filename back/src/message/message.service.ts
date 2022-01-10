import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { Channel } from 'src/channel/channel.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async findChannelMessages(channel: Channel): Promise<Message[]> {
    return await this.messageRepository.find({
      where: {
        channel: channel,
      },
    });
  }

  async addMessage(
    channel: Channel,
    user: User,
    msg: string,
    gameInvite: boolean,
  ): Promise<void> {
    await this.messageRepository.save({
      message: msg,
      channel: channel,
      user: user,
      gameInvite: gameInvite,
    });
  }
}
