import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerAddressEntity } from './entities/customer-address.entity';
import { Repository } from 'typeorm';
import { CreateCustomerAddressDto } from './dtos/create-customer-address.dto';

@Injectable()
export class CustomerAddressService {
  constructor(
    @InjectRepository(CustomerAddressEntity)
    private readonly customerAddressRepository: Repository<CustomerAddressEntity>,
  ) {}

  async create(
    createCustomerAddressDto: CreateCustomerAddressDto,
  ): Promise<string> {
    const createdCustomerAddress = this.customerAddressRepository.create(
      createCustomerAddressDto,
    );

    await this.customerAddressRepository.save(createdCustomerAddress);

    return createdCustomerAddress.id;
  }

  async findOne(id: string): Promise<CustomerAddressEntity> {
    return this.customerAddressRepository.findOne({
      where: {
        id,
      },
    });
  }
}
