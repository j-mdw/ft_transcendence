import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ nullable: true, default: null })
  pseudo: string;

  @Column({ nullable: true, default: null })
  picture_path: string;

  @Exclude()
  public currentHashedRefreshToken?: string;
}
