import type { PaginationMeta } from '../common/pagination-meta.type.ts'
import type { LocationResponseDto } from './location-response.type.ts'

export interface PaginatedLocationsResponseDto {
  data: LocationResponseDto[]
  meta: PaginationMeta
}
