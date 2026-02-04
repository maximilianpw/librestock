import type { UserRole } from '../auth/user-role.enum'

export interface UserResponseDto {
  id: string
  name: string
  email: string
  image: string | null
  roles: UserRole[]
  banned: boolean
  banReason: string | null
  banExpires: string | Date | null
  createdAt: string | Date
}
