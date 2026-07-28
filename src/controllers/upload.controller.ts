import {
  BadRequestException,
  Controller,
  HttpCode,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { randomUUID } from 'crypto'
import { diskStorage } from 'multer'

import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import {
  ALLOWED_IMAGE_TYPES,
  MAX_UPLOAD_BYTES,
  ensureUploadDir,
  publicUploadUrl,
} from '../helpers/upload'

@Controller('api/v1/uploads')
@UseGuards(JwtAuthGuard)
export class UploadController {
  // Stores the bytes and hands back a URL. Attaching it to a user or a post is the
  // caller's job (PATCH /users/current, POST /posts) — upload mutates nothing.
  @Post('image')
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => cb(null, ensureUploadDir()),
        filename: (_req, file, cb) =>
          cb(null, `${randomUUID()}${ALLOWED_IMAGE_TYPES[file.mimetype]}`),
      }),
      limits: { fileSize: MAX_UPLOAD_BYTES },
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_IMAGE_TYPES[file.mimetype]) {
          cb(new BadRequestException(`Unsupported image type: ${file.mimetype}`), false)
          return
        }
        cb(null, true)
      },
    }),
  )
  async image(@Request() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No image file provided')
    }

    return {
      status: 'success',
      message: 'Image uploaded',
      data: {
        url: publicUploadUrl(req, file.filename),
        filename: file.filename,
      },
    }
  }
}
