import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('channel')
export class Channel {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({
    nullable: true,
  })
  password: string;

  @ManyToOne(() => User, (channelOwner) => channelOwner.id)
  owner: User;

  @OneToMany(() => ChannelUser, (channelUser) => channelUser.user)
  users: User[];
}

@Entity('channelUsers')
export class ChannelUser {
  @Column()
  role: string; //"owner" | "admin" | "normal"

  @Column()
  status: string; //"banned" | "muted" | "normal" --> Where shoul I define theses type?

  @Column({
    nullable: true,
  })
  statusEnd: Date;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Channel, (channel) => channel.id)
  channel: Channel;
}
