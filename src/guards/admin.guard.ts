import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../entities/user.entity'

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const userId = request.user?.id

    if (!userId) {
      throw new ForbiddenException('Unauthorized')
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { role: true },
    })

    if (!user || !user.role || user.role.name !== 'admin') {
      throw new ForbiddenException('Forbidden: Permission denied')
    }

    return true
  }
}
