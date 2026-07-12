import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm'
import { User } from './user.entity'

@Entity('follows')
@Unique(['follower', 'following'])
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, (user) => user.following)
  @JoinColumn()
  follower: User

  @ManyToOne(() => User, (user) => user.followers)
  @JoinColumn()
  following: User

  @CreateDateColumn()
  createdAt: Date
}
