import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Channel } from 'src/channel/channel.entity';
import { User } from 'src/user/user.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  readonly id: string;

  @Column({
    nullable: false,
  })
  message: string;

  @Column({
    nullable: false,
    default: false,
  })
  gameInvite: boolean;

  @Column({
    nullable: false,
  })
  date: Date;

  @ManyToOne(() => Channel, (channel) => channel.id, {
    eager: true,
    onDelete: 'CASCADE',
  })
  channel: Channel;

  @ManyToOne(() => User, (user) => user.id, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;
}
