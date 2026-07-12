import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as crypto from 'node:crypto'
import { encode } from 'hi-base32'
import * as OTPAuth from 'otpauth'
import { ConfigService } from '@nestjs/config'

import { User } from '../entities/user.entity'

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async generate(userId: string) {
    const user = await this.findUser(userId)

    const base32_secret = this.generateBase32Secret()
    const otpauth_url = this.buildTotp(user, base32_secret).toString()

    user.otp_auth_url = otpauth_url
    user.otp_base32 = base32_secret
    await this.userRepository.save(user)

    return {
      status: 'success',
      message: 'OTP secret generated',
      data: { secret: base32_secret, base32: base32_secret, otpauth_url },
    }
  }

  async disable(userId: string) {
    const user = await this.findUser(userId)

    user.is_otp_enabled = false
    user.otp_base32 = null
    user.otp_auth_url = null
    await this.userRepository.save(user)
    return { status: 'success', message: 'OTP disabled successfully' }
  }

  async verify(userId: string, token: string | undefined) {
    const user = await this.findUser(userId)
    if (!user.otp_base32) throw new BadRequestException('OTP is not set up')

    const delta = this.buildTotp(user, user.otp_base32).validate({ token: String(token ?? '') })
    if (delta === null) throw new UnauthorizedException('Authentication failed')

    user.is_otp_verified = true
    user.is_otp_enabled = true
    await this.userRepository.save(user)
    return { status: 'success', message: 'OTP verified successfully' }
  }

  async validate(userId: string, token: string | undefined) {
    const user = await this.findUser(userId)
    if (!user.is_otp_enabled || !user.otp_base32) {
      throw new BadRequestException('OTP is not enabled for this user')
    }

    const delta = this.buildTotp(user, user.otp_base32).validate({
      token: String(token ?? ''),
      window: 1,
    })
    if (delta === null) throw new UnauthorizedException('Invalid token')

    return { status: 'success', message: 'Token is valid' }
  }

  private async findUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId })
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  private buildTotp(user: User, secret: string): OTPAuth.TOTP {
    return new OTPAuth.TOTP({
      issuer: this.configService.get<string>('FRONTEND_URL') || 'CLIuno',
      label: user.username,
      algorithm: 'SHA1',
      digits: 6,
      secret,
    })
  }

  private generateBase32Secret(): string {
    const buffer = crypto.randomBytes(15)
    return encode(buffer).replaceAll('=', '').substring(0, 24)
  }
}
