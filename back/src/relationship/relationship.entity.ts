import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/user/user.entity';

export enum RelationshipType {
  none,
  sent,
  received,
  friend,
  blocked,
}

@Entity('relationship')
export class Relationship {
  @PrimaryGeneratedColumn()
  readonly id: string;

  @Column({
    nullable: false,
    default: RelationshipType.none,
  })
  type: RelationshipType;

  @ManyToOne(() => User, (user) => user.id, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => User, (user) => user.id, {
    eager: true,
    onDelete: 'CASCADE',
  })
  peer: User;
}
