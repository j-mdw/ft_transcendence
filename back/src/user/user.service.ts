import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from './user.entity';
import { UsersDTO } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity) private usersRepository: Repository<UsersEntity>,
  ) {}
  
  async getUsers(): Promise<UsersEntity[]> {
    return await this.usersRepository.find();
  }

 async findOne(id: string): Promise<UsersDTO>  {
    return await this.usersRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async findEmail(email: string): Promise<UsersDTO> {
    return await this.usersRepository.findOne({
      where: {
        email: email,
      },
    });
  }



  async createUser(data: UsersDTO) {
    const user = this.usersRepository.create(data);
    await this.usersRepository.save(data);
    return user;
  }

 async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
 }

  async update(id: string, data: Partial<UsersDTO>) {
    await this.usersRepository.update({ id }, data);
    return await this.usersRepository.findOne({ id });
  }
}