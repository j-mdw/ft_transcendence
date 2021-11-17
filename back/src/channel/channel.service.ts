import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private usersRepository: Repository<Channel>,
  ) {}

  findAll(): Promise<Channel[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<Channel> {
    return this.usersRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
