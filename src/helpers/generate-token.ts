import * as crypto from 'crypto'
import { Repository } from 'typeorm'
import { BlacklistedToken } from '../entities/blacklistedToken.entity'

export async function generateToken(blacklistRepo: Repository<BlacklistedToken>): Promise<string> {
  const token = crypto.randomBytes(20).toString('hex')

  const isTokenBlacklisted = await blacklistRepo.findOneBy({ token })
  if (isTokenBlacklisted) {
    return generateToken(blacklistRepo)
  }

  return token
}
