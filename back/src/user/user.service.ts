import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDTO } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: string): Promise<UserDTO> {
    return await this.usersRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async findEmail(email: string): Promise<UserDTO> {
    return await this.usersRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async createUser(data: UserDTO) {
    const user = this.usersRepository.create(data);
    await this.usersRepository.save(data);
    return user;
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async update_pseudo(id: string, pseudo: string) {
    const editedUser = await this.usersRepository.findOne(id);
    console.log(editedUser);
    if (!editedUser) {
      throw new NotFoundException('User is not found');
    }
    editedUser.pseudo = pseudo;
    await this.usersRepository.save(editedUser);
    console.log(editedUser);
    return editedUser;
  }
}
