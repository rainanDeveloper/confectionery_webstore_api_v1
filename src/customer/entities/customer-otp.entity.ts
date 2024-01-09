import { Column, Entity } from 'typeorm';

@Entity('customer_otp')
export class CustomerOtpEntity {
  @Column()
  otp: string;

  @Column()
  email: string;
}
