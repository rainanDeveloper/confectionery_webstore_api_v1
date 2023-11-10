import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerAddressEntity } from './entities/customer-address.entity';
import { CustomerAddressService } from './customer-address.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerAddressEntity])],
  providers: [CustomerAddressService],
})
export class CustomerAddressModule {}
