import { CartEntity } from 'src/cart/entities/cart.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cart_item')
export class CartItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @ManyToOne(() => CartEntity, (cart) => cart.itens)
  @JoinColumn({ name: 'cart_id' })
  cart: CartEntity;

  @Column({
    name: 'unit_value',
    type: 'decimal',
    precision: 4,
    nullable: false,
    default: 0,
  })
  unitValue: number;

  @Column({
    name: 'quantity',
    type: 'decimal',
    precision: 4,
    nullable: false,
    default: 1,
  })
  quantity: number;

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
