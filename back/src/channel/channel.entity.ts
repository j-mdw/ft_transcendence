import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { ChannelParticipant } from 'src/channelParticipant/channelParticipant.entity';

export enum ChannelType {
  public,
  private,
  password,
}

@Entity('channels')
export class Channel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: ChannelType;

  @Column({
    nullable: true,
    default: null,
  })
  password: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @ManyToOne(() => User, (owner) => owner.id)
  owner: User;

  @OneToMany(() => ChannelParticipant, (participant) => participant.user)
  participants: ChannelParticipant[];
}
