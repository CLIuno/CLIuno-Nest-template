import * as fs from 'fs'
import * as path from 'path'

const logFilePath = path.join(__dirname, '../../logs/error.log')
const logDir = path.dirname(logFilePath)

export default function logThisError(error: any) {
  const errorMessage = `${new Date().toISOString()} - ${
    typeof error === 'object' ? JSON.stringify(error, null, 2) : error
  }\n`

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true })
  }

  if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, '')
  }

  fs.appendFileSync(logFilePath, errorMessage)
}
