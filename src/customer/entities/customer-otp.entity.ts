import { Column, Entity } from 'typeorm';

@Entity('customer_otp')
export class CustomerOtp {
  @Column()
  otp: string;

  @Column()
  email: string;
}
