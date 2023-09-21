import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('order')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'total',
    type: 'decimal',
    precision: 4,
    nullable: false,
    default: 0,
  })
  total: number;
}
