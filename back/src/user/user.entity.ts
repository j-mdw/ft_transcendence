import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Channel, ChannelUsers } from '../channel/channel.entity';

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

  @OneToMany(() => BlockedUsers, (blocked) => blocked.id)
  blocked: BlockedUsers[];
}

@Entity('block')
export class BlockedUsers {
  @Column()
  id: string;

  @ManyToOne(() => UsersEntity, (user) => user.blocked)
  user: UsersEntity;
}
