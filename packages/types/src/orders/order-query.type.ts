import { OrderStatus } from './order-status.enum';

export interface OrderQueryType {
  page?: number;
  limit?: number;
  q?: string;
  client_id?: string;
  status?: OrderStatus;
  date_from?: string;
  date_to?: string;
}
