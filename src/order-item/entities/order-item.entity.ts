import { OrderEntity } from 'src/order/entities/order.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { ColumnNumericTransformer } from 'src/utils/column-numeric-transformer.class';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('order_item')
export class OrderItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @ManyToOne(() => OrderEntity, (order) => order.itens)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @Column({
    name: 'unit_value',
    type: 'decimal',
    precision: 10,
    scale: 4,
    transformer: new ColumnNumericTransformer(),
    nullable: false,
    default: 0,
  })
  unitValue: number;

  @Column({
    name: 'quantity',
    type: 'decimal',
    precision: 10,
    scale: 4,
    transformer: new ColumnNumericTransformer(),
    nullable: false,
    default: 0,
  })
  quantity: number;

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
