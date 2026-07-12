import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common'
import { OtpService } from '../services/otp.service'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'

@Controller('api/v1/auth/otp')
@UseGuards(JwtAuthGuard)
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('verify')
  async verify(@Request() req, @Body() body: { otp?: string; token?: string }) {
    return this.otpService.verify(req.user.id, body?.otp ?? body?.token)
  }

  @Post('generate')
  async generate(@Request() req) {
    return this.otpService.generate(req.user.id)
  }

  @Post('validate')
  async validate(@Request() req, @Body() body: { otp?: string; token?: string }) {
    return this.otpService.validate(req.user.id, body?.otp ?? body?.token)
  }

  @Post('disable')
  async disable(@Request() req) {
    return this.otpService.disable(req.user.id)
  }
}
