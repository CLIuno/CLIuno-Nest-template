import { Controller, Get, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common'
import { UserService } from '../services/user.service'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { AdminGuard } from '../guards/admin.guard'

@Controller('api/v1/users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('current')
  async getCurrent(@Request() req) {
    return this.userService.getCurrent(req.user.id)
  }

  @Patch('current')
  async updateCurrent(@Request() req, @Body() body: any) {
    return this.userService.updateCurrent(req.user.id, body)
  }

  @Delete('current')
  async deleteCurrent(@Request() req) {
    return this.userService.deleteCurrent(req.user.id)
  }

  @Get('username/:username')
  async getByUsername(@Param('username') username: string) {
    return this.userService.getByUsername(username)
  }

  @Get('posts')
  async getPostsByUserId(@Body('user_id') userId: string) {
    return this.userService.getPostsByUserId(userId)
  }

  @Get('role')
  async getRolesByUserId(@Body('user_id') userId: string) {
    return this.userService.getRolesByUserId(userId)
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.userService.getById(id)
  }

  @UseGuards(AdminGuard)
  @Get()
  async getAll() {
    return this.userService.getAll()
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.userService.update(id, body)
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(id)
  }
}
