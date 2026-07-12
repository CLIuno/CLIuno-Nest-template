import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common'
import { RoleService } from '../services/role.service'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { AdminGuard } from '../guards/admin.guard'
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dto'

@Controller('api/v1/roles')
@UseGuards(JwtAuthGuard, AdminGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async getAll() {
    return this.roleService.getAll()
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.roleService.getById(id)
  }

  @Post()
  async create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto)
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.roleService.update(id, dto)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.roleService.delete(id)
  }

  @Get(':role_id/users')
  async getUsersByRoleId(@Param('role_id') roleId: string) {
    return this.roleService.getUsersByRoleId(roleId)
  }
}
