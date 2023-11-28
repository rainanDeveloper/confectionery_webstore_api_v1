import { CustomerEntity } from 'src/customer/entities/customer.entity';
import {
  Column,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartStatus } from '../enums/cart-status.enum';

export class CartEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CustomerEntity)
  customer: CustomerEntity;

  @Column({
    name: 'total',
    type: 'decimal',
    precision: 4,
    nullable: false,
    default: 0,
  })
  total: number;

  @Column()
  status: CartStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
