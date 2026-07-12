import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm'
import { Exclude } from 'class-transformer'
import { Role } from './role.entity'
import { Post } from './post.entity'
import { Todo } from './todo.entity'
import { Comment } from './comment.entity'
import { Follow } from './follow.entity'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  username: string

  @Column({ nullable: true })
  first_name: string

  @Column({ nullable: true })
  last_name: string

  @Column({ nullable: true })
  date_of_birth: string

  @Column({ nullable: true })
  gender: string

  @Column({ nullable: true })
  nationality: string

  @Column({ nullable: true })
  phone: string

  @Column({ unique: true })
  email: string

  @Exclude()
  @Column()
  password: string

  @Column({ default: false })
  is_online: boolean

  @Column({ default: false })
  is_verified: boolean

  @Column({ default: false })
  is_otp_enabled: boolean

  @Column({ default: false })
  is_otp_verified: boolean

  @Exclude()
  @Column({ nullable: true })
  otp_base32: string

  @Exclude()
  @Column({ nullable: true })
  otp_auth_url: string

  @Exclude()
  @Column({ nullable: true })
  refresh_token: string

  @Column({ default: false })
  is_deleted: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @ManyToOne(() => Role, (role) => role.users, { eager: true, nullable: true })
  @JoinColumn()
  role: Role

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[]

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[]

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[]

  @OneToMany(() => Follow, (follow) => follow.follower)
  following: Follow[]

  @OneToMany(() => Follow, (follow) => follow.following)
  followers: Follow[]
}
