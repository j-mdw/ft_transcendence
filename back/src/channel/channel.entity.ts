import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/user/user.entity';
// import { ChannelParticipant } from 'src/channelParticipant/channelParticipant.entity';

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
  })
  readonly createdAt: Date;

  @Column({
    nullable: false,
  })
  updatedAt: Date;

  @ManyToOne(() => User, (owner) => owner.id)
  // @JoinColumn({ name: 'ownerId' })
  readonly owner: User;

  // @Column()
  // readonly ownerId: string;
  // @OneToMany(() => ChannelParticipant, (participant) => participant.user)
  // participants: ChannelParticipant[];
}
