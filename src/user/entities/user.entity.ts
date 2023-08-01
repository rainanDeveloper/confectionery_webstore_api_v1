import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { hashSync } from 'bcrypt';
import { BcryptHelper } from '../../helpers/bcrypt.helpers';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ name: 'is_active', default: true, type: 'boolean' })
  isActive: boolean;

  @Column({ name: 'first_access', default: true, type: 'boolean' })
  firstAccess: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  hashPassword() {
    this.password = hashSync(this.password, BcryptHelper.saltRounds);
  }
}
