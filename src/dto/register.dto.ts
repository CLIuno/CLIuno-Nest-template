import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator'

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  first_name: string

  @IsString()
  @IsNotEmpty()
  last_name: string

  @IsString()
  @IsNotEmpty()
  username: string

  @IsString()
  @IsNotEmpty()
  phone: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string

  @IsString()
  password_confirmation: string
}
