import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDTO } from './user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    return await this.usersRepository.findOne(id);
  }

  async findEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async create(data: UserDTO) {
    const user = this.usersRepository.create(data); //Not sure if I need to save after a create --> Need to test that
    await this.usersRepository.save(data);
    return user;
  }

  async delete(id: string) {
    await this.usersRepository.delete(id);
  }

  //TBU --> Need to update User with fields not 'undefined' in 'data' and if pseudo is defined, check if it is not already in use, in which case we need to communicate this to the front
  async update(id: string, data: UserDTO) {
    const editedUser = await this.usersRepository.findOne(id);
    if (!editedUser) {
      throw new NotFoundException('User is not found');
    }
    if (data.pseudo) {
      const userPseudo = await this.usersRepository.findOne({
        where: {
          pseudo: data.pseudo,
        }
      });
      if (userPseudo) {
        throw new NotFoundException('Pseudo already in use!!'); //Need to use an appropriate exception
      }
    }
    this.usersRepository.update()
    }

    if (data.pseudo) {
      const editedUser = await this.usersRepository.findOne(id);
      if (!editedUser) {
        throw new NotFoundException('User is not found');
      }
    }
    editedUser.pseudo = pseudo;
    await this.usersRepository.save(editedUser);
    console.log(editedUser);
    return editedUser;
  }
}
