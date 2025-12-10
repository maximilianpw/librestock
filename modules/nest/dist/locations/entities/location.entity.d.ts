import { LocationType } from '../../common/enums';
export declare class Location {
    id: string;
    name: string;
    type: LocationType;
    address: string | null;
    contact_person: string | null;
    phone: string | null;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
