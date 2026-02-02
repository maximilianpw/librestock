import type { PaginationMeta } from '../common/pagination-meta.type.js'
import type { LocationResponseDto } from './location-response.type.js'

export interface PaginatedLocationsResponseDto {
  data: LocationResponseDto[]
  meta: PaginationMeta
}
