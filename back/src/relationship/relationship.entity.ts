import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity('relationships')
export class Relationship {
  @Column()
  peer: string;

  @Column({
    default: false,
  })
  friend: boolean;

  @Column({
    default: false,
  })
  blocked: boolean;

  @ManyToOne(() => User, (user) => user.relationships)
  user: User;
}
