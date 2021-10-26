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

  // async editUser(id: number, note: User): Promise<User> {
  //   const editedNote = await this.usersRepository.findOne(id);
  //   if (!editedNote) {
  //     throw new NotFoundException('Note is not found');
  //   }
  //   editedUser.description = note.description;
  //   editedNote.title = note.title;
  //   await editedNote.save();
  //   return editedNote;
  // }
}