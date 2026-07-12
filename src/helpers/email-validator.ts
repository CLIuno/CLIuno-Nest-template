const tester: RegExp =
  /^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/

export function emailValidate(email: string | null): boolean {
  if (!email) return false
  if (email.length > 254) return false

  const valid: boolean = tester.test(email)
  if (!valid) return false

  const parts: any = email.split('@')
  if (parts[0].length > 64) return false

  const domainParts: string[] = parts[1].split('.')
  if (domainParts.some((part) => part.length > 63)) return false

  return true
}
