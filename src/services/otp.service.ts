import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as crypto from 'node:crypto'
import { encode } from 'hi-base32'
import * as OTPAuth from 'otpauth'
import { ConfigService } from '@nestjs/config'

import { User } from '../entities/user.entity'
import { emailValidate } from '../helpers/email-validator'

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async generate(usernameOrEmail: string) {
    if (!usernameOrEmail) throw new BadRequestException('usernameOrEmail is required')

    const isEmail = emailValidate(usernameOrEmail)
    const user = await this.userRepository.findOneBy(
      isEmail ? { email: usernameOrEmail } : { username: usernameOrEmail },
    )
    if (!user) throw new NotFoundException('User not found')

    const base32_secret = this.generateBase32Secret()
    const totp = new OTPAuth.TOTP({
      issuer: this.configService.get<string>('FRONTEND_URL'),
      label: user.username,
      algorithm: 'SHA1',
      digits: 6,
      secret: base32_secret,
    })

    const otpauth_url = totp.toString()
    user.otp_auth_url = otpauth_url
    user.otp_base32 = base32_secret
    await this.userRepository.save(user)

    return { status: 'success', base32: base32_secret, otpauth_url }
  }

  async disable(usernameOrEmail: string) {
    if (!usernameOrEmail) throw new BadRequestException('usernameOrEmail is required')

    const isEmail = emailValidate(usernameOrEmail)
    const user = await this.userRepository.findOneBy(
      isEmail ? { email: usernameOrEmail } : { username: usernameOrEmail },
    )
    if (!user) throw new NotFoundException('User not found')

    user.is_otp_enabled = false
    await this.userRepository.save(user)
    return { status: 'success', message: 'OTP disabled successfully' }
  }

  async verify(usernameOrEmail: string, token: string) {
    if (!usernameOrEmail) throw new BadRequestException('usernameOrEmail is required')

    const isEmail = emailValidate(usernameOrEmail)
    const user = await this.userRepository.findOneBy(
      isEmail ? { email: usernameOrEmail } : { username: usernameOrEmail },
    )
    if (!user) throw new NotFoundException('Token is invalid or user does not exist')

    const totp = new OTPAuth.TOTP({
      issuer: this.configService.get<string>('FRONTEND_URL'),
      label: user.username,
      algorithm: 'SHA1',
      digits: 6,
      secret: user.otp_base32,
    })

    const delta = totp.validate({ token })
    if (delta === null) throw new BadRequestException('Authentication failed')

    user.is_otp_verified = true
    user.is_otp_enabled = true
    await this.userRepository.save(user)
    return { status: 'success', message: 'OTP verified successfully' }
  }

  async validate(usernameOrEmail: string, token: string) {
    if (!usernameOrEmail) throw new BadRequestException('usernameOrEmail is required')

    const isEmail = emailValidate(usernameOrEmail)
    const user = await this.userRepository.findOneBy(
      isEmail ? { email: usernameOrEmail } : { username: usernameOrEmail },
    )
    if (!user) throw new NotFoundException('User not found')
    if (!user.is_otp_enabled) throw new BadRequestException('OTP is not enabled for this user')

    const totp = new OTPAuth.TOTP({
      issuer: this.configService.get<string>('FRONTEND_URL'),
      label: user.username,
      algorithm: 'SHA1',
      digits: 6,
      secret: user.otp_base32,
    })

    const delta = totp.validate({ token, window: 1 })
    if (delta === null) throw new BadRequestException('Invalid token')

    return { status: 'success', message: 'Token is valid' }
  }

  private generateBase32Secret(): string {
    const buffer = crypto.randomBytes(15)
    return encode(buffer).replaceAll('=', '').substring(0, 24)
  }
}
