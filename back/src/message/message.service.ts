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
    return (
      await this.messageRepository.find({
        where: {
          channel: channel,
        },
      })
    ).sort((msg1, msg2) => msg1.date.getTime() - msg2.date.getTime());
  }

  async addMessage(
    channel: Channel,
    user: User,
    msg: string,
    date: Date,
    gameInvite: boolean,
  ): Promise<void> {
    await this.messageRepository.save({
      message: msg,
      channel: channel,
      user: user,
      gameInvite: gameInvite,
      date: date,
    });
  }
}
