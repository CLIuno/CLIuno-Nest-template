import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { OtpService } from '../services/otp.service'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'

@Controller('api/v1/auth/otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('verify')
  async verify(@Body('usernameOrEmail') usernameOrEmail: string, @Body('token') token: string) {
    return this.otpService.verify(usernameOrEmail, token)
  }

  @UseGuards(JwtAuthGuard)
  @Post('generate')
  async generate(@Body('usernameOrEmail') usernameOrEmail: string) {
    return this.otpService.generate(usernameOrEmail)
  }

  @UseGuards(JwtAuthGuard)
  @Post('validate')
  async validate(@Body('usernameOrEmail') usernameOrEmail: string, @Body('token') token: string) {
    return this.otpService.validate(usernameOrEmail, token)
  }

  @UseGuards(JwtAuthGuard)
  @Post('disable')
  async disable(@Body('usernameOrEmail') usernameOrEmail: string) {
    return this.otpService.disable(usernameOrEmail)
  }
}
