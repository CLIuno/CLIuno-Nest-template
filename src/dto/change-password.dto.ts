import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator'

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  user_id: string

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string

  @IsString()
  password_confirmation: string
}
