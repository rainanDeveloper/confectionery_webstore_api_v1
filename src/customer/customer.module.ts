import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { CustomerService } from './customer.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([CustomerEntity])],
  providers: [CustomerService],
})
export class CustomerModule {}
