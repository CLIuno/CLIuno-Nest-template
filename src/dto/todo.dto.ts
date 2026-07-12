import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator'

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsOptional()
  description?: string
}

export class UpdateTodoDto {
  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsBoolean()
  @IsOptional()
  is_completed?: boolean
}
