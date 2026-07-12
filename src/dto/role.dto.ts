import { IsString, IsNotEmpty } from 'class-validator'

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string
}

export class UpdateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string
}
