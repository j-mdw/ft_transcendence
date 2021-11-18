import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UsersEntity } from '../user/user.entity';

@Entity('channel')
export class Channel {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @OneToMany(() => ChannelUsers, (channel_user) => channel_user.user)
  users: UsersEntity[];
}

@Entity('channel_users')
export class ChannelUsers {
  @ManyToOne(() => UsersEntity, (user) => user.id)
  user: UsersEntity;

  @ManyToOne(() => Channel, (channel) => channel.id)
  channel: Channel;

  @Column()
  role: string; //"owner" | "admin" | "normal"

  @Column()
  status: string; //"banned" | "muted" | "normal" --> Where shoul I define theses type?

  @Column({
    nullable: true,
  })
  status_end: Date;
}
