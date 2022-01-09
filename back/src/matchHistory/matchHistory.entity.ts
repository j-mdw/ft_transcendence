import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity('messages')
export class MatchHistory {
  @PrimaryGeneratedColumn()
  readonly id: string;

  @Column({
    nullable: false,
  })
  user1Score: number;

  @Column({
    nullable: false,
  })
  user2Score: number;

  @Column({
    nullable: false,
  })
  readonly createdAt: Date;

  @ManyToOne(() => User, (user) => user.id, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user1: User;

  @ManyToOne(() => User, (user) => user.id, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user2: User;
}
