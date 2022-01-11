import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Channel } from 'src/channel/channel.entity';
// import { Relationship } from 'src/relationship/relationship.entity';
import { ChannelParticipant } from 'src/channelParticipant/channelParticipant.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({
    nullable: false,
  })
  firstName: string;

  @Column({
    nullable: false,
  })
  lastName: string;

  @Column({
    nullable: false,
  })
  email: string;

  @Column({
    nullable: true,
    default: null,
  })
  pseudo: string;

  @Column({
    nullable: false,
    default: 0,
  })
  victories: number;

  @Column({
    nullable: false,
    default: 0,
  })
  defeats: number;

  @Column({
    nullable: false,
    default: false,
  })
  admin: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  banned: boolean;

  @Column({
    nullable: true,
    default: null,
  })
  public twoFactorAuthenticationSecret?: string;

  @Column({ default: false })
  public isTwoFactorAuthenticationEnabled: boolean;

  @Column({
    nullable: true,
    default: null,
  })
  avatarPath: string;

  @Column({
    nullable: false,
  })
  readonly createdAt: Date;

  @Column({
    nullable: false,
  })
  updatedAt: Date;

  @OneToMany(() => Channel, (channel) => channel.owner)
  channels: Channel[];

  @OneToMany(() => ChannelParticipant, (participant) => participant.user)
  channelsParticipants: ChannelParticipant[];
}
