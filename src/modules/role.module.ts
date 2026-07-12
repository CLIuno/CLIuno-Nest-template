import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { RoleController } from '../controllers/role.controller'
import { RoleService } from '../services/role.service'
import { Role } from '../entities/role.entity'
import { User } from '../entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Role, User])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
