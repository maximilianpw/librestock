import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Location } from '../../locations/entities/location.entity';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  product_id: string;

  @Column({ type: 'uuid' })
  location_id: string;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'varchar', nullable: true })
  batch_number: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  expiry_date: Date | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  cost_per_unit: number | null;

  @Column({ type: 'timestamptz', nullable: true })
  received_date: Date | null;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
