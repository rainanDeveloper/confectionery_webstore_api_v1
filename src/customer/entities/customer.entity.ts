import { hashSync } from 'bcrypt';
import { BcryptHelper } from 'src/helpers/bcrypt.helpers';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  hashPassword() {
    if (this.password) {
      this.password = hashSync(this.password, BcryptHelper.saltRounds);
    }
  }
}
