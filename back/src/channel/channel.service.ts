import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { ChannelDTO } from './channel.dto';
import { UsersService } from 'src/user/user.service';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @Inject()
    private userService: UsersService,
  ) {}

  //How is Channel ID generated automatically if I use DTO?

  async findAll(): Promise<Channel[]> {
    return await this.channelRepository.find();
  }

  async findOne(id: string): Promise<Channel> {
    return await this.channelRepository.findOne(id);
  }

  async create(data: ChannelDTO) {
    const channel = this.channelRepository.create(data);
    const date = new Date();
    channel.createdAt = date;
    channel.updatedAt = date;

    channel.owner = await this.userService.findOne('1');
    //channel.id = getUserId(); Need to implement way to get the User ID from the request
    this.channelRepository.save(channel);
  }

  async update(id: string, date: ChannelDTO){}

  async delete(id: string): Promise<void> {
    await this.channelRepository.delete(id);
  }
}
