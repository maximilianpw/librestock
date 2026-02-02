import type { AuditAction } from './audit-action.enum.js'
import type { AuditChanges } from './audit-changes.type.js'
import type { AuditEntityType } from './audit-entity-type.enum.js'

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
