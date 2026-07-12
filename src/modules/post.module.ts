import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PostController } from '../controllers/post.controller'
import { PostService } from '../services/post.service'
import { CommentService } from '../services/comment.service'
import { Post } from '../entities/post.entity'
import { User } from '../entities/user.entity'
import { Comment } from '../entities/comment.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Comment])],
  controllers: [PostController],
  providers: [PostService, CommentService],
  exports: [PostService, CommentService],
})
export class PostModule {}
