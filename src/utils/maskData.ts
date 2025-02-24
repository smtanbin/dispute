export const maskPAN = (pan: string): string => {
  if (!pan) return ""
  return pan.replace(/^(\d{6})(\d+)(\d{4})$/, "$1******$3")
}

export const maskPhone = (phone: string): string => {
  if (!phone) return ""
  return phone.replace(/^(\d{3})(\d+)(\d{2})$/, "$1*****$3")
}

export const maskEmail = (email: string): string => {
  if (!email) return ""
  const [localPart, domain] = email.split("@")
  const maskedLocal =
    localPart.charAt(0) +
    "*".repeat(localPart.length - 2) +
    localPart.charAt(localPart.length - 1)
  return `${maskedLocal}@${domain}`
}

export const maskAccount = (account: string): string => {
  if (!account) return ""
  return "*".repeat(account.length - 4) + account.slice(-4)
}
