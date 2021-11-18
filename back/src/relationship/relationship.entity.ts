import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity('relationships')
export class Relationship {
  @Column()
  peer: string;

  @Column()
  friend: boolean;

  @Column()
  blocked: boolean;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
