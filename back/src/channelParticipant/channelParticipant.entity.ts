import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Channel } from 'src/channel/channel.entity';

@Entity('channelsParticipants')
export class ChannelParticipant {
  @PrimaryGeneratedColumn() //Useless but cannot create the table without a primaryColumn (there might be a better solution)
  readonly id: string;

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

  @ManyToOne(() => Channel, (channel) => channel.id, {
    onDelete: 'CASCADE',
  })
  channel: Channel;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  user: User;
}
