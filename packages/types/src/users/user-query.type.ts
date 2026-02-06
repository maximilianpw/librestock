import type { UserRole } from '../auth/user-role.enum'

export interface UserQueryDto {
  page?: number
  limit?: number
  search?: string
  role?: UserRole
}
