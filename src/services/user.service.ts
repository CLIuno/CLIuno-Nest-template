import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { plainToInstance } from 'class-transformer'

import { User } from '../entities/user.entity'
import { Post } from '../entities/post.entity'
import { Role } from '../entities/role.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async getAll() {
    const users = await this.userRepository.find()
    return {
      status: 'success',
      message: 'Users fetched successfully',
      data: { users: users.map((u) => plainToInstance(User, u)) },
    }
  }

  async getById(id: string) {
    const user = await this.userRepository.findOneBy({ id })
    if (!user) throw new NotFoundException('User not found')
    return { status: 'success', data: { user: plainToInstance(User, user) } }
  }

  async getCurrent(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId })
    if (!user) throw new NotFoundException('User not found')
    return { status: 'success', data: { user: plainToInstance(User, user) } }
  }

  async getByUsername(username: string) {
    const user = await this.userRepository.findOneBy({ username })
    if (!user) throw new NotFoundException('User not found')
    return { status: 'success', data: { user: plainToInstance(User, user) } }
  }

  async updateCurrent(userId: string, body: Partial<User>) {
    const user = await this.userRepository.findOneBy({ id: userId })
    if (!user) throw new NotFoundException('User not found')

    this.userRepository.merge(user, body)
    const updated = await this.userRepository.save(user)
    return {
      status: 'success',
      message: 'User updated',
      data: { transformed: plainToInstance(User, updated) },
    }
  }

  async update(id: string, body: Partial<User>) {
    const user = await this.userRepository.findOneBy({ id })
    if (!user) throw new NotFoundException('User not found')

    this.userRepository.merge(user, body)
    const updated = await this.userRepository.save(user)
    return { status: 'success', data: plainToInstance(User, updated) }
  }

  async deleteCurrent(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId })
    if (!user) throw new NotFoundException('User not found')

    user.is_deleted = true
    const updated = await this.userRepository.save(user)
    return {
      status: 'success',
      message: 'User deleted',
      data: { transformed: plainToInstance(User, updated) },
    }
  }

  async delete(id: string) {
    const user = await this.userRepository.findOneBy({ id })
    if (!user) throw new NotFoundException('User not found')

    user.is_deleted = true
    const updated = await this.userRepository.save(user)
    return { status: 'success', data: plainToInstance(User, updated) }
  }

  async getPostsByUserId(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId })
    if (!user) throw new NotFoundException('User not found')

    const posts = await this.postRepository.find({ where: { user: { id: userId } } })
    return { status: 'success', message: 'Posts', data: { posts } }
  }

  async getRolesByUserId(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role'],
    })
    if (!user) throw new NotFoundException('User not found')

    return { status: 'success', message: 'Role found', data: { role: user.role } }
  }
}
