import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('payment_method')
export class PaymentMethodEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'varchar', nullable: false })
  name: string;

  @Column({
    name: 'status',
    type: 'boolean',
    default: false,
    nullable: false,
  })
  status: boolean;

  @Column({
    name: 'application_key',
    type: 'varchar',
    nullable: true,
  })
  applicationKey: string;

  @Column({
    name: 'optional_data_1',
    type: 'varchar',
    nullable: true,
  })
  optionalData1?: string;

  @Column({
    name: 'optional_data_2',
    type: 'varchar',
    nullable: true,
  })
  optionalData2?: string;

  @Column({
    name: 'optional_data_3',
    type: 'varchar',
    nullable: true,
  })
  optionalData3?: string;
}
