import { OrderEntity } from 'src/order/entities/order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('order_item')
export class OrderItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OrderEntity, (order) => order.itens)
  order: OrderEntity;

  @Column({
    name: 'unit_value',
    type: 'decimal',
    precision: 4,
    nullable: false,
    default: 0,
  })
  unitValue: number;

  @Column({
    name: 'amount',
    type: 'decimal',
    precision: 4,
    nullable: false,
    default: 0,
  })
  amount: number;

  @Column({
    name: 'total',
    type: 'decimal',
    precision: 4,
    nullable: false,
    default: 0,
  })
  total: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
