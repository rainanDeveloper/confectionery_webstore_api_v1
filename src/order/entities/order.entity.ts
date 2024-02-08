import { OrderItemEntity } from 'src/order-item/entities/order-item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from '../enum/order-status.enum';
import { CustomerEntity } from 'src/customer/entities/customer.entity';
import { ColumnNumericTransformer } from 'src/utils/column-numeric-transformer.class';

@Entity('order')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CustomerEntity)
  @JoinColumn({
    name: 'customer_id',
  })
  customer: CustomerEntity;

  @OneToMany(() => OrderItemEntity, (item) => item.order)
  itens: OrderItemEntity[];

  @Column({
    name: 'total',
    type: 'decimal',
    precision: 10,
    scale: 4,
    transformer: new ColumnNumericTransformer(),
    nullable: false,
    default: 0,
  })
  total: number;

  @Column({ type: 'varchar' })
  status: OrderStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
