import { AuditAction } from '../../common/enums';
export declare class AuditLog {
    id: string;
    user_id: string | null;
    action: AuditAction;
    entity_type: string;
    entity_id: string;
    changes: object | null;
    ip_address: string | null;
    created_at: Date;
}
