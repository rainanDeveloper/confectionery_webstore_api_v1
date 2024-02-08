import { CategoryEntity } from 'src/category/entities/category.entity';
import { ColumnNumericTransformer } from 'src/utils/column-numeric-transformer.class';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'title', type: 'varchar', nullable: false })
  title: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({
    name: 'cost',
    type: 'decimal',
    precision: 10,
    scale: 4,
    nullable: false,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  cost: number;

  @Column({
    name: 'profit_percent',
    type: 'decimal',
    precision: 10,
    scale: 4,
    nullable: false,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  profitPercent: number;

  @Column({
    name: 'profit',
    type: 'decimal',
    precision: 10,
    scale: 4,
    nullable: false,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  profit: number;

  @Column({
    name: 'unit_value',
    type: 'decimal',
    precision: 10,
    scale: 4,
    nullable: false,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  unitValue: number;

  @ManyToMany(() => CategoryEntity, (category) => category.products)
  @JoinTable({
    name: 'product_category',
  })
  categories: CategoryEntity[];

  @Column({
    name: 'stock_amount',
    type: 'decimal',
    precision: 10,
    scale: 4,
    nullable: false,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  stockAmount: number;

  @Column({
    name: 'stock_reserved_amount',
    type: 'decimal',
    precision: 10,
    scale: 4,
    nullable: false,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  stockReservedAmount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  validateProduct() {
    if (this.cost <= 0) throw new Error(`Cost cannot be less or equal zero`);

    if (this.unitValue < this.cost)
      throw new Error(`Product unit value cannot be lower than its cost`);

    this.profitPercent = ((this.unitValue - this.cost) / this.unitValue) * 100;
    this.profit = (this.profitPercent * this.unitValue) / 100;
  }
}
