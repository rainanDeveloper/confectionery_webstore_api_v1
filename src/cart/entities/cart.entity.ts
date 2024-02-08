import { CustomerEntity } from 'src/customer/entities/customer.entity';
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
import { CartStatus } from '../enums/cart-status.enum';
import { CartItemEntity } from 'src/cart-item/entities/cart-item.entity';
import { ColumnNumericTransformer } from 'src/utils/column-numeric-transformer.class';

@Entity('cart')
export class CartEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CustomerEntity)
  @JoinColumn({
    name: 'customer_id',
  })
  customer: CustomerEntity;

  @OneToMany(() => CartItemEntity, (item) => item.cart)
  itens: CartItemEntity[];

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

  @Column({ type: 'smallint' })
  status: CartStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
