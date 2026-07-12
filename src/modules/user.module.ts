import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserController } from '../controllers/user.controller'
import { UserService } from '../services/user.service'
import { User } from '../entities/user.entity'
import { Post } from '../entities/post.entity'
import { Role } from '../entities/role.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, Post, Role])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
