import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional } from 'class-validator'

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string

  @IsOptional()
  @IsString()
  password_confirmation?: string
}
