import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import * as crypto from 'crypto';
@Entity('users')
export class UsersEntity {
      @PrimaryGeneratedColumn()
      id: string;

      @Column()
      firstName: string;

      @Column()
      lastName: string;

      @Column()
      email: string;
}