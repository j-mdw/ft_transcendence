import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Channel } from 'src/channel/channel.entity';
import { Relationship } from 'src/relationship/relationship.entity';
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
    nullable: true,
    default: null,
  })
  picturePath: string;

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

  @OneToMany(() => Relationship, (relation) => relation.user)
  relationships: Relationship[];
}
