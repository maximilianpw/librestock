import type { UserRole } from '../auth/user-role.enum'

export interface UpdateUserRolesDto {
  roles: UserRole[]
}
