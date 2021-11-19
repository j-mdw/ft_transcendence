import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/user/user.entity';

export enum channelType {
  public,
  private,
  password,
}

@Entity('channels')
export class Channel {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  name: string;

  @Column()
  type: channelType;

  @Column({
    nullable: true,
    default: null,
  })
  password: string;

  @ManyToOne(() => User, (owner) => owner.id)
  owner: User;

  @OneToMany(() => ChannelParticipant, (participant) => participant.user)
  participants: ChannelParticipant[];
}

@Entity('channelsParticipants')
export class ChannelParticipant {
  @Column({
    default: false,
  })
  admin: boolean;

  @Column({
    default: false,
  })
  banned: boolean;

  @Column({
    default: false,
  })
  muted: boolean;

  @Column({
    nullable: true,
    default: null,
  })
  muteEnd: Date;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Channel, (channel) => channel.id)
  channel: Channel;
}
