import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity } from 'typeorm';
import { Channel } from 'src/channel/channel.entity';
import { Relationship } from 'src/relationship/relationship.entity';
import { ChannelParticipant } from 'src/channelParticipant/channelParticipant.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
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

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @OneToMany(() => Channel, (channel) => channel.owner)
  channels: Channel[];

  @OneToMany(() => ChannelParticipant, (participant) => participant.user)
  channelsParticipants: ChannelParticipant[];

  @OneToMany(() => Relationship, (relation) => relation.user)
  relationships: Relationship[];
}
