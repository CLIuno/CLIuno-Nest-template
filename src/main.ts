import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import type { NestExpressApplication } from '@nestjs/platform-express'
import helmet from 'helmet'
import { AppModule } from './modules/app.module'
import { ensureUploadDir } from './helpers/upload'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // Uploaded images are public and unversioned — no /api/v1 prefix.
  app.useStaticAssets(ensureUploadDir(), { prefix: '/uploads' })

  app.use(helmet())
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5000',
    credentials: true,
  })
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
