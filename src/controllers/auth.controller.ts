import { Controller, Post, Body, Headers, UseGuards, Get } from '@nestjs/common'
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
  async refreshToken(@Headers('authorization') auth: string) {
    const token = auth?.split(' ')[1]
    return this.authService.refreshToken(token)
  }

  @UseGuards(JwtAuthGuard)
  @Post('check-token')
  async checkToken(@Headers('authorization') auth: string) {
    const token = auth?.split(' ')[1]
    return this.authService.checkToken(token)
  }

  @Post('send-verify-email')
  async sendVerifyEmail(@Body('email') email: string) {
    return this.authService.sendVerifyEmail(email)
  }

  @Post('verify-email')
  async verifyEmail(@Body('user_id') userId: string, @Body('token') token: string) {
    return this.authService.verifyEmail(userId, token)
  }

  @Post('forgot-password')
  async forgotPassword(@Body('usernameOrEmail') usernameOrEmail: string) {
    return this.authService.forgotPassword(usernameOrEmail)
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(dto)
  }

  @Get()
  fallback() {
    return { status: 'warning', message: 'Invalid request' }
  }
}
