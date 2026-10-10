import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Follow } from '../entities/follow.entity'
import { User } from '../entities/user.entity'

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow) private readonly followRepository: Repository<Follow>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async follow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself')
    }

    const follower = await this.userRepository.findOneBy({ id: followerId })
    const following = await this.userRepository.findOneBy({ id: followingId })
    if (!follower || !following) throw new NotFoundException('User not found')

    const existing = await this.followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    })
    if (existing) throw new BadRequestException('Already following this user')

    const follow = this.followRepository.create({ follower, following })
    await this.followRepository.save(follow)
    return { status: 'success', message: 'User followed successfully' }
  }

  async unfollow(followerId: string, followingId: string) {
    const follow = await this.followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    })
    if (!follow) throw new NotFoundException('Not following this user')

    await this.followRepository.remove(follow)
    return { status: 'success', message: 'User unfollowed successfully' }
  }

  async getFollowers(userId: string) {
    const follows = await this.followRepository.find({
      where: { following: { id: userId } },
      relations: { follower: true },
    })
    const followers = follows.map((f) => f.follower)
    return { status: 'success', message: 'Followers fetched successfully', data: { followers } }
  }

  async getFollowing(userId: string) {
    const follows = await this.followRepository.find({
      where: { follower: { id: userId } },
      relations: { following: true },
    })
    const following = follows.map((f) => f.following)
    return { status: 'success', message: 'Following fetched successfully', data: { following } }
  }

  async isFollowing(followerId: string, followingId: string) {
    const follow = await this.followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    })
    return { status: 'success', data: { isFollowing: !!follow } }
  }
}
