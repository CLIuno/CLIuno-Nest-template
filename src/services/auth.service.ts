import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config'

import { User } from '../entities/user.entity'
import { Role } from '../entities/role.entity'
import { BlacklistedToken } from '../entities/blacklistedToken.entity'
import { RegisterDto } from '../dto/register.dto'
import { LoginDto } from '../dto/login.dto'
import { ResetPasswordDto } from '../dto/reset-password.dto'
import { ChangePasswordDto } from '../dto/change-password.dto'
import { emailValidate } from '../helpers/email-validator'
import { sendEmail } from '../helpers/email-sender'
import { generateToken } from '../helpers/generate-token'

@Injectable()
export class AuthService {
  private readonly saltRounds = 10

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(BlacklistedToken)
    private readonly blacklistRepository: Repository<BlacklistedToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    if (!emailValidate(dto.email)) {
      throw new BadRequestException('Invalid email address')
    }

    const userExists = await this.userRepository.findOne({
      where: [{ username: dto.username }, { email: dto.email }],
    })
    if (userExists) {
      throw new BadRequestException('User already exists')
    }

    const hashedPassword = await bcrypt.hash(dto.password, this.saltRounds)

    // Default role is created on first use so a fresh install works out of the box
    let role = await this.roleRepository.findOne({ where: { name: 'user' } })
    role ??= await this.roleRepository.save(this.roleRepository.create({ name: 'user' }))

    const newUser = this.userRepository.create({
      ...dto,
      password: hashedPassword,
      role,
    })
    await this.userRepository.save(newUser)

    const token = await generateToken(this.blacklistRepository)
    sendEmail.verifyEmail(dto.email, token, newUser.id)

    return {
      status: 'success',
      message: 'User created successfully and an email has been sent to you for verification',
    }
  }

  async login(dto: LoginDto) {
    const isEmail = emailValidate(dto.usernameOrEmail)
    const user = await this.userRepository.findOneBy(
      isEmail ? { email: dto.usernameOrEmail } : { username: dto.usernameOrEmail },
    )

    if (!user) {
      throw new UnauthorizedException('Invalid username/email or password')
    }
    if (user.is_deleted) {
      throw new UnauthorizedException('User is deleted')
    }
    if (!user.is_verified) {
      throw new UnauthorizedException('Please verify your email address')
    }

    const isMatch = await bcrypt.compare(dto.password, user.password)
    if (!isMatch) {
      throw new UnauthorizedException('Wrong username/email or password')
    }

    const payload = { id: user.id, username: user.username, email: user.email }
    const jwtSecret = this.configService.get<string>('JWT_SECRET_KEY')
    const refreshSecret = this.configService.get<string>('REFRESH_JWT_SECRET_KEY')

    const token = this.jwtService.sign(payload, { secret: jwtSecret, expiresIn: '1h' })
    const refreshToken = this.jwtService.sign(payload, { secret: refreshSecret, expiresIn: '7d' })

    return {
      status: 'success',
      message: 'Login successful',
      data: {
        first_name: user.first_name,
        last_name: user.last_name,
        is_otp_enabled: user.is_otp_enabled,
        token,
        refreshToken,
      },
    }
  }

  async logout(token: string) {
    const existing = await this.blacklistRepository.findOne({ where: { token } })
    if (existing) {
      throw new UnauthorizedException('Token has already been invalidated')
    }

    const blacklistedToken = new BlacklistedToken()
    blacklistedToken.token = token
    blacklistedToken.invalidatedAt = new Date()
    await this.blacklistRepository.save(blacklistedToken)

    return { status: 'success', message: 'Logout successful' }
  }

  async checkToken(token: string) {
    const blacklisted = await this.blacklistRepository.findOne({ where: { token } })
    if (blacklisted) {
      throw new UnauthorizedException('Token has already been invalidated')
    }

    try {
      const jwtSecret = this.configService.get<string>('JWT_SECRET_KEY')
      this.jwtService.verify(token, { secret: jwtSecret })
      return { status: 'success', message: 'Token is valid' }
    } catch {
      throw new UnauthorizedException('Invalid token')
    }
  }

  async refreshToken(token: string) {
    const blacklisted = await this.blacklistRepository.findOne({ where: { token } })
    if (blacklisted) {
      throw new UnauthorizedException('Token has already been invalidated')
    }

    try {
      const refreshSecret = this.configService.get<string>('REFRESH_JWT_SECRET_KEY')
      const jwtSecret = this.configService.get<string>('JWT_SECRET_KEY')
      const decoded: any = this.jwtService.verify(token, { secret: refreshSecret })

      const newToken = this.jwtService.sign(
        { id: decoded.id, username: decoded.username, email: decoded.email },
        { secret: jwtSecret, expiresIn: '1h' },
      )
      const newRefreshToken = this.jwtService.sign(
        { id: decoded.id, username: decoded.username, email: decoded.email },
        { secret: refreshSecret, expiresIn: '7d' },
      )

      return {
        status: 'success',
        message: 'Token refreshed successfully',
        data: { token: newToken, refreshToken: newRefreshToken },
      }
    } catch {
      throw new UnauthorizedException('Invalid token')
    }
  }

  async sendVerifyEmail(email: string) {
    if (!email) {
      throw new BadRequestException('Email is required')
    }

    const user = await this.userRepository.findOneBy({ email })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    const token = await generateToken(this.blacklistRepository)
    sendEmail.verifyEmail(email, token, user.id)

    return { status: 'success', message: 'Email sent successfully' }
  }

  async verifyEmail(userId: string, token: string) {
    const user = await this.userRepository.findOneBy({ id: userId })
    if (!user) {
      throw new BadRequestException('User does not exist')
    }

    const blacklisted = await this.blacklistRepository.findOne({ where: { token } })
    if (blacklisted) {
      throw new UnauthorizedException('Token has already been invalidated')
    }

    const newBlacklisted = new BlacklistedToken()
    newBlacklisted.token = token
    newBlacklisted.invalidatedAt = new Date()
    await this.blacklistRepository.save(newBlacklisted)

    user.is_verified = true

    const jwtSecret = this.configService.get<string>('JWT_SECRET_KEY')
    const refreshSecret = this.configService.get<string>('REFRESH_JWT_SECRET_KEY')
    const payload = { id: user.id, username: user.username, email: user.email }

    const newToken = this.jwtService.sign(payload, { secret: jwtSecret, expiresIn: '1h' })
    const newRefreshToken = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: '7d',
    })

    user.refresh_token = newRefreshToken
    await this.userRepository.save(user)

    return {
      status: 'success',
      message: 'Email verified successfully',
      data: { token: newToken, refreshToken: newRefreshToken },
    }
  }

  async forgotPassword(usernameOrEmail: string) {
    if (!usernameOrEmail) {
      throw new BadRequestException('Email or Username is required')
    }

    const isEmail = emailValidate(usernameOrEmail)
    const user = await this.userRepository.findOneBy(
      isEmail ? { email: usernameOrEmail } : { username: usernameOrEmail },
    )
    if (!user) {
      throw new UnauthorizedException('Invalid username/email')
    }

    const token = await generateToken(this.blacklistRepository)
    sendEmail.resetPassword(user.email, token, user.id)

    return { status: 'success', message: 'Email sent successfully' }
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userRepository.findOneBy({ id: dto.user_id })
    if (!user) {
      throw new BadRequestException('User does not exist')
    }

    const blacklisted = await this.blacklistRepository.findOne({ where: { token: dto.token } })
    if (blacklisted) {
      throw new UnauthorizedException('Token has already been invalidated')
    }

    const newBlacklisted = new BlacklistedToken()
    newBlacklisted.token = dto.token
    newBlacklisted.invalidatedAt = new Date()
    await this.blacklistRepository.save(newBlacklisted)

    user.password = await bcrypt.hash(dto.password, this.saltRounds)
    await this.userRepository.save(user)

    return { status: 'success', message: 'Password reset successful' }
  }

  async changePassword(dto: ChangePasswordDto) {
    const user = await this.userRepository.findOneBy({ id: dto.user_id })
    if (!user) {
      throw new BadRequestException('User does not exist')
    }

    user.password = await bcrypt.hash(dto.password, this.saltRounds)
    await this.userRepository.save(user)

    return { status: 'success', message: 'Password changed successfully' }
  }
}
