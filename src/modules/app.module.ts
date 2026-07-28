import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ThrottlerModule } from '@nestjs/throttler'

import { AppController } from '../controllers/app.controller'
import { AppService } from '../services/app.service'
import { AuthModule } from './auth.module'
import { UserModule } from './user.module'
import { TodoModule } from './todo.module'
import { FollowModule } from './follow.module'
import { PostModule } from './post.module'
import { RoleModule } from './role.module'
import { UploadModule } from './upload.module'

import { User } from '../entities/user.entity'
import { Role } from '../entities/role.entity'
import { Post } from '../entities/post.entity'
import { Todo } from '../entities/todo.entity'
import { Comment } from '../entities/comment.entity'
import { Follow } from '../entities/follow.entity'
import { BlacklistedToken } from '../entities/blacklistedToken.entity'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.sqlite',
      entities: [User, Role, Post, Todo, Comment, Follow, BlacklistedToken],
      synchronize: true,
    }),
    ThrottlerModule.forRoot([{ ttl: 900000, limit: 100 }]),
    AuthModule,
    UserModule,
    TodoModule,
    FollowModule,
    PostModule,
    RoleModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
