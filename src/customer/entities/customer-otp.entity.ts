import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity('customer_otp')
export class CustomerOtpEntity {
  @Column()
  otp: string;

  @Column()
  email: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
