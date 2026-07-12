import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Role } from '../entities/role.entity'
import { User } from '../entities/user.entity'
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dto'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getAll() {
    const roles = await this.roleRepository.find()
    return { status: 'success', message: 'Roles fetched successfully', data: { roles } }
  }

  async getById(id: string) {
    const role = await this.roleRepository.findOneBy({ id })
    if (!role) throw new NotFoundException('Role not found')
    return { status: 'success', message: 'Role fetched successfully', data: { role } }
  }

  async create(dto: CreateRoleDto) {
    if (!dto.name) throw new BadRequestException('Role name is required')

    const existing = await this.roleRepository.findOneBy({ name: dto.name })
    if (existing) throw new BadRequestException('Role already exists')

    const newRole = this.roleRepository.create(dto)
    const savedRole = await this.roleRepository.save(newRole)
    return { status: 'success', message: 'Role created successfully', data: { savedRole } }
  }

  async update(id: string, dto: UpdateRoleDto) {
    const role = await this.roleRepository.findOneBy({ id })
    if (!role) throw new NotFoundException('Role not found')

    this.roleRepository.merge(role, dto)
    const updatedRole = await this.roleRepository.save(role)
    return { status: 'success', message: 'Role updated successfully', data: { updatedRole } }
  }

  async delete(id: string) {
    const role = await this.roleRepository.findOneBy({ id })
    if (!role) throw new NotFoundException('Role not found')

    await this.roleRepository.delete(id)
    return { status: 'success', message: 'Role deleted successfully' }
  }

  async getUsersByRoleId(roleId: string) {
    const role = await this.roleRepository.findOneBy({ id: roleId })
    if (!role) throw new NotFoundException('Role not found')

    const users = await this.userRepository.find({ where: { role: { id: roleId } } })
    return { status: 'success', message: 'Users found', data: { users } }
  }
}
