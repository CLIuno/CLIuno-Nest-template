import { IsString, IsNotEmpty } from 'class-validator'

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  usernameOrEmail: string

  @IsString()
  @IsNotEmpty()
  password: string
}
