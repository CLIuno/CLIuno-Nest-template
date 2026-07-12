import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common'
import { PostService } from '../services/post.service'
import { CommentService } from '../services/comment.service'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto'
import { CreateCommentDto, UpdateCommentDto } from '../dto/comment.dto'

@Controller('api/v1/posts')
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly commentService: CommentService,
  ) {}

  @Get('current-user')
  async getCurrentUserPosts(@Request() req) {
    return this.postService.getCurrentUserPosts(req.user.id)
  }

  @Get()
  async getAll() {
    return this.postService.getAll()
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.postService.getById(id)
  }

  @Post()
  async create(@Request() req, @Body() dto: CreatePostDto) {
    return this.postService.create(req.user.id, dto)
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.postService.update(id, dto)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.postService.delete(id)
  }

  @Get(':post_id/user')
  async getUserByPostId(@Param('post_id') postId: string) {
    return this.postService.getUserByPostId(postId)
  }

  // Comments on posts
  @Get(':post_id/comments')
  async getComments(@Param('post_id') postId: string) {
    return this.commentService.getByPostId(postId)
  }

  @Post(':post_id/comments')
  async createComment(
    @Request() req,
    @Param('post_id') postId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentService.create(req.user.id, postId, dto)
  }

  @Patch(':post_id/comments/:id')
  async updateComment(@Request() req, @Param('id') id: string, @Body() dto: UpdateCommentDto) {
    return this.commentService.update(req.user.id, id, dto)
  }

  @Delete(':post_id/comments/:id')
  async deleteComment(@Request() req, @Param('id') id: string) {
    return this.commentService.delete(req.user.id, id)
  }
}
