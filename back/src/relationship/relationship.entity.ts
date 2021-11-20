import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity('relationships')
export class Relationship {
  @Column()
  readonly peer: string;

  @Column({
    default: false,
  })
  friend: boolean;

  @Column({
    default: false,
  })
  pendingFriendRequest: boolean;

  @Column({
    default: false,
  })
  blocked: boolean;

  @ManyToOne(() => User, (user) => user.relationships)
  readonly user: User;
}
