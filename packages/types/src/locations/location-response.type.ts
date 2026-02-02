import type { BaseResponseDto } from '../common/base-response.type.ts'
import type { LocationType } from './location-type.enum.ts'

export interface LocationResponseDto extends BaseResponseDto {
  id: string
  name: string
  type: LocationType
  address: string
  contact_person: string
  phone: string
  is_active: boolean
}
