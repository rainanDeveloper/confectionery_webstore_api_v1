import { CustomerEntity } from 'src/customer/entities/customer.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('customer_address')
export class CustomerAddressEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CustomerEntity, (customer) => customer.addresses)
  customer: CustomerEntity;

  @Column({ name: 'zip_code', type: 'char', length: 10, nullable: false })
  zipCode: string;

  @Column({ name: 'address_line_1', type: 'varchar', nullable: false })
  addressLine1: string;

  @Column({ name: 'address_line_2', type: 'varchar', nullable: false })
  addressLine2: string;

  @Column({ type: 'varchar', nullable: false })
  city: string;

  @Column({ type: 'varchar', nullable: false })
  state: string;

  @Column({ type: 'varchar', nullable: false })
  country: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
