import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  channelId: number;

  @Column()
  channelName: string;

  @Column()
  channelType: string;
}
