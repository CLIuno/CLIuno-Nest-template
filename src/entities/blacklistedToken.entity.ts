import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('blacklisted_tokens')
export class BlacklistedToken {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  token: string

  @Column()
  invalidatedAt: Date
}
