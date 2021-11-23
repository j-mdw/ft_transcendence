import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity('relationships')
export class Relationship {
  @PrimaryGeneratedColumn() //Useless but cannot create the table without a primaryColumn (there might be a better solution)
  id: number;

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
