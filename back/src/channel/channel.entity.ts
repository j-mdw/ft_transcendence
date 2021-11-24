import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/user/user.entity';
// import { ChannelParticipant } from 'src/channelParticipant/channelParticipant.entity';

export enum ChannelType {
  public,
  private,
  password,
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
  })
  readonly createdAt: Date;

  @Column({
    nullable: false,
  })
  updatedAt: Date;

  @ManyToOne(() => User, (owner) => owner.id)
  readonly owner: User;

  // @OneToMany(() => ChannelParticipant, (participant) => participant.user)
  // participants: ChannelParticipant[];
}
