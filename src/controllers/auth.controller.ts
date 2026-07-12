import { Controller, Post, Body, Headers, UseGuards, Get, Request } from '@nestjs/common'
import { AuthService } from '../services/auth.service'
import { RegisterDto } from '../dto/register.dto'
import { LoginDto } from '../dto/login.dto'
import { ResetPasswordDto } from '../dto/reset-password.dto'
import { ChangePasswordDto } from '../dto/change-password.dto'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  @Post('logout')
  async logout(@Headers('authorization') auth: string) {
    const token = auth?.split(' ')[1]
    return this.authService.logout(token)
  }

  @Post('refresh-token')
  async refreshToken(
    @Headers('authorization') auth: string,
    @Body('refreshToken') bodyToken?: string,
  ) {
    // Frontends send the refresh token in the body; the header is a fallback
    const token = bodyToken ?? auth?.split(' ')[1]
    return this.authService.refreshToken(token)
  }

  @UseGuards(JwtAuthGuard)
  @Post('check-token')
  async checkToken(@Headers('authorization') auth: string) {
    const token = auth?.split(' ')[1]
    return this.authService.checkToken(token)
  }

  @UseGuards(JwtAuthGuard)
  @Post('send-verify-email')
  async sendVerifyEmail(@Request() req, @Body('email') email: string) {
    return this.authService.sendVerifyEmail(email, req.user?.id)
  }

  @Post('verify-email')
  async verifyEmail(@Body('token') token: string) {
    return this.authService.verifyEmail(token)
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body('email') email: string,
    @Body('usernameOrEmail') usernameOrEmail: string,
  ) {
    // Frontends send `email`; `usernameOrEmail` is kept for compatibility
    return this.authService.forgotPassword(email || usernameOrEmail)
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.id, dto)
  }

  @Get()
  fallback() {
    return { status: 'warning', message: 'Invalid request' }
  }
}
