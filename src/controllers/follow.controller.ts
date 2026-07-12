import { Controller, Get, Post, Delete, Param, UseGuards, Request } from '@nestjs/common'
import { FollowService } from '../services/follow.service'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'

@Controller('api/v1/follows')
@UseGuards(JwtAuthGuard)
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post(':user_id/follow')
  async follow(@Request() req, @Param('user_id') userId: string) {
    return this.followService.follow(req.user.id, userId)
  }

  @Delete(':user_id/follow')
  async unfollow(@Request() req, @Param('user_id') userId: string) {
    return this.followService.unfollow(req.user.id, userId)
  }

  @Get(':user_id/followers')
  async getFollowers(@Param('user_id') userId: string) {
    return this.followService.getFollowers(userId)
  }

  @Get(':user_id/following')
  async getFollowing(@Param('user_id') userId: string) {
    return this.followService.getFollowing(userId)
  }

  @Get(':user_id/is-following')
  async isFollowing(@Request() req, @Param('user_id') userId: string) {
    return this.followService.isFollowing(req.user.id, userId)
  }
}
