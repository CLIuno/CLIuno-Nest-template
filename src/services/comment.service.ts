import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Comment } from '../entities/comment.entity'
import { Post } from '../entities/post.entity'
import { User } from '../entities/user.entity'
import { CreateCommentDto, UpdateCommentDto } from '../dto/comment.dto'

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getByPostId(postId: string) {
    const comments = await this.commentRepository.find({
      where: { post: { id: postId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    })
    return { status: 'success', message: 'Comments fetched successfully', data: { comments } }
  }

  async create(userId: string, postId: string, dto: CreateCommentDto) {
    if (!dto.content) throw new BadRequestException('Content is required')

    const user = await this.userRepository.findOneBy({ id: userId })
    if (!user) throw new NotFoundException('User not found')

    const post = await this.postRepository.findOneBy({ id: postId })
    if (!post) throw new NotFoundException('Post not found')

    const comment = this.commentRepository.create({ content: dto.content, user, post })
    const result = await this.commentRepository.save(comment)
    return {
      status: 'success',
      message: 'Comment created successfully',
      data: { comment: result },
    }
  }

  async update(userId: string, id: string, dto: UpdateCommentDto) {
    const comment = await this.commentRepository.findOne({ where: { id }, relations: ['user'] })
    if (!comment) throw new NotFoundException('Comment not found')
    if (comment.user.id !== userId)
      throw new ForbiddenException('You can only update your own comments')

    comment.content = dto.content || comment.content
    await this.commentRepository.save(comment)
    return { status: 'success', message: 'Comment updated successfully', data: { comment } }
  }

  async delete(userId: string, id: string) {
    const comment = await this.commentRepository.findOne({ where: { id }, relations: ['user'] })
    if (!comment) throw new NotFoundException('Comment not found')
    if (comment.user.id !== userId)
      throw new ForbiddenException('You can only delete your own comments')

    await this.commentRepository.remove(comment)
    return { status: 'success', message: 'Comment deleted successfully' }
  }
}
