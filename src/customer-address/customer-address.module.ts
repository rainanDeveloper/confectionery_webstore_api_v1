import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerAddressEntity } from './entities/customer-address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerAddressEntity])],
})
export class CustomerAddressModule {}
