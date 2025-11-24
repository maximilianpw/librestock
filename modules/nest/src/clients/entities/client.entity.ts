import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClientStatus } from '../../common/enums';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  company_name: string;

  @Column({ type: 'varchar', nullable: true })
  yacht_name: string | null;

  @Column({ type: 'varchar' })
  contact_person: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string | null;

  @Column({ type: 'text', nullable: true })
  billing_address: string | null;

  @Column({ type: 'text', nullable: true })
  default_delivery_address: string | null;

  @Column({
    type: 'enum',
    enum: ClientStatus,
    default: ClientStatus.ACTIVE,
  })
  account_status: ClientStatus;

  @Column({ type: 'varchar', nullable: true })
  payment_terms: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  credit_limit: number | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
