import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator'

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  newPassword: string
}
