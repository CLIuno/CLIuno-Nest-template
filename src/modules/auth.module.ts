import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { AuthController } from '../controllers/auth.controller'
import { OtpController } from '../controllers/otp.controller'
import { AuthService } from '../services/auth.service'
import { OtpService } from '../services/otp.service'
import { JwtStrategy } from '../strategies/jwt.strategy'
import { User } from '../entities/user.entity'
import { Role } from '../entities/role.entity'
import { BlacklistedToken } from '../entities/blacklistedToken.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, BlacklistedToken]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, OtpController],
  providers: [AuthService, OtpService, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
