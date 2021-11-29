import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { User } from 'src/user/user.entity';

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
  owner: User;
}
