import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { ChannelParticipant } from 'src/channelParticipant/channelParticipant.entity';
import { Message } from 'src/message/message.entity';

export enum ChannelType {
  public,
  private,
  protected,
}

@Entity('channels')
export class Channel {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
  })
  type: ChannelType;

  @Column({
    nullable: true,
    default: null,
  })
  password: string;

  @Column({
    nullable: false,
    default: false,
  })
  readonly DM: boolean;

  @Column({
    nullable: false,
  })
  readonly createdAt: Date;

  @Column({
    nullable: false,
  })
  updatedAt: Date;

  @ManyToOne(() => User, (owner) => owner.id, {
    eager: true,
    onDelete: 'CASCADE',
  })
  owner: User;

  @OneToMany(() => ChannelParticipant, (participant) => participant.channel)
  channels: Channel[];

  @OneToMany(() => Message, (message) => message.channel)
  messages: Message[];
}
