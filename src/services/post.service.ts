import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Post } from '../entities/post.entity'
import { User } from '../entities/user.entity'
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto'

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getCurrentUserPosts(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId })
    if (!user) throw new NotFoundException('User not found')

    const posts = await this.postRepository.find({
      where: { user: { id: user.id } },
      relations: ['user', 'comments', 'comments.user'],
    })
    return { status: 'success', message: 'User posts fetched successfully', data: { posts } }
  }

  async getAll() {
    const posts = await this.postRepository.find({
      relations: ['user', 'comments', 'comments.user'],
      order: { createdAt: 'DESC' },
    })
    return { status: 'success', message: 'Posts fetched successfully', data: { posts } }
  }

  async getById(id: string) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user', 'comments', 'comments.user'],
    })
    if (!post) throw new NotFoundException('Post not found')
    return { status: 'success', message: 'Post fetched successfully', data: { post } }
  }

  async create(dto: CreatePostDto) {
    if (!dto.title || !dto.content) throw new BadRequestException('Title and Content are required')

    const post = this.postRepository.create(dto)
    const result = await this.postRepository.save(post)
    return { status: 'success', message: 'Post created successfully', data: { result } }
  }

  async update(id: string, dto: UpdatePostDto) {
    const post = await this.postRepository.findOneBy({ id })
    if (!post) throw new NotFoundException('Post not found')

    this.postRepository.merge(post, dto)
    await this.postRepository.save(post)
    return { status: 'success', message: 'Post updated successfully' }
  }

  async delete(id: string) {
    const result = await this.postRepository.delete(id)
    if (result.affected === 0) throw new NotFoundException('Post not found or already deleted')
    return { status: 'success', message: 'Post deleted successfully' }
  }

  async getUserByPostId(postId: string) {
    const post = await this.postRepository.findOne({ where: { id: postId }, relations: ['user'] })
    if (!post) throw new NotFoundException('Post not found')
    return { status: 'success', message: 'User found', data: { user: post.user } }
  }
}
