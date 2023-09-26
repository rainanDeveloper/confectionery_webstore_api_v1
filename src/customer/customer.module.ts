import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customer.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([CustomerEntity])],
})
export class CustomerModule {}
