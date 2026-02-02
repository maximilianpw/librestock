import type { LocationType } from './location-type.enum.ts'

export interface CreateLocationDto {
  name: string
  type: LocationType
  address?: string
  contact_person?: string
  phone?: string
  is_active?: boolean
}
