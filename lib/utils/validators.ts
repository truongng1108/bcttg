export const PHONE_REGEX = /^\d{8,15}$/

export function normalizePhone(phone: string): string {
  return phone.trim()
}

export function isValidPhone(phone: string): boolean {
  return PHONE_REGEX.test(normalizePhone(phone))
}


