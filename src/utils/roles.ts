export const ROLES = {
  ADMIN: 'admin',
  USER: 'user' 
} as const

export const hasRole = (userRole: string, requiredRole: string) => {
  if (userRole === ROLES.ADMIN) return true // Admin has access to everything
  return userRole === requiredRole
}
