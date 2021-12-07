import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Channel } from 'src/channel/channel.entity';

export enum UserStatus {
  online,
  offline,
  playing,
}

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

  // @Exclude()
  // public currentHashedRefreshToken?: string;

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
    default: UserStatus.offline,
  })
  status: UserStatus;

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
}
