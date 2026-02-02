import type { PaginationMeta } from '../common/pagination-meta.type.js'
import type { AuditLogResponseDto } from './audit-log-response.type.js'

export interface PaginatedAuditLogsResponseDto {
  data: AuditLogResponseDto[]
  meta: PaginationMeta
}
