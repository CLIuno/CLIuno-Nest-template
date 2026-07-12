import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator'

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  content: string

  @IsString()
  @IsOptional()
  imageUrl?: string

  @IsBoolean()
  @IsOptional()
  is_paid?: boolean
}

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  content?: string

  @IsString()
  @IsOptional()
  imageUrl?: string

  @IsBoolean()
  @IsOptional()
  is_paid?: boolean
}
