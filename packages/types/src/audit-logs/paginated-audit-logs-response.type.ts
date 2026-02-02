import type { PaginationMeta } from '../common/pagination-meta.type.ts'
import type { AuditLogResponseDto } from './audit-log-response.type.ts'

export interface PaginatedAuditLogsResponseDto {
  data: AuditLogResponseDto[]
  meta: PaginationMeta
}
