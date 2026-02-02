import type { AuditAction } from './audit-action.enum.ts'
import type { AuditChanges } from './audit-changes.type.ts'
import type { AuditEntityType } from './audit-entity-type.enum.ts'

export interface AuditLogResponseDto {
  id: string
  user_id: string | null
  action: AuditAction
  entity_type: AuditEntityType
  entity_id: string
  changes: AuditChanges | null
  ip_address: string | null
  user_agent: string | null
  created_at: string | Date
}
