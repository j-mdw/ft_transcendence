import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Channel, ChannelParticipant } from 'src/channel/channel.entity';
import { Relationship } from 'src/relationship/relationship.entity';

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
  picture_path: string;

  @OneToMany(() => Channel, (channel) => channel.owner)
  channels: Channel[];

  @OneToMany(() => ChannelParticipant, (participant) => participant.user)
  channelsParticipants: ChannelParticipant[];

  @OneToMany(() => Relationship, (relation) => relation.user)
  relationships: Relationship[];
}
