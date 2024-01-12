import { hashSync } from 'bcrypt';
import { CustomerAddressEntity } from 'src/customer-address/entities/customer-address.entity';
import { BcryptHelper } from 'src/helpers/bcrypt.helpers';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('customer')
export class CustomerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  login: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
  })
  name: string;

  @Column({
    type: 'char',
    length: 15,
    name: 'contact_phone',
  })
  contactPhone: string;

  @Column({
    type: 'char',
    length: 15,
  })
  whatsapp: string;

  @OneToMany(() => CustomerAddressEntity, (address) => address.customer)
  addresses: CustomerAddressEntity;

  @Column({ name: 'is_active', type: 'boolean', default: false })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    this.password = hashSync(this.password, BcryptHelper.saltRounds);
  }
}
