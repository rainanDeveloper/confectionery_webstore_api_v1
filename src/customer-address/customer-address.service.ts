import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerAddressEntity } from './entities/customer-address.entity';
import { Repository } from 'typeorm';
import { CreateCustomerAddressDto } from './dtos/create-customer-address.dto';
import { UpdateCustomerAddressDto } from './dtos/update-customer-address.dto';

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

  async findAll(customerId: string): Promise<CustomerAddressEntity[]> {
    return this.customerAddressRepository.find({
      where: {
        customer: {
          id: customerId,
        },
      },
    });
  }

  async findOne(
    customerId: string,
    id: string,
  ): Promise<CustomerAddressEntity> {
    return this.customerAddressRepository.findOne({
      where: {
        customer: {
          id: customerId,
        },
        id,
      },
    });
  }

  async update(
    customerId,
    id: string,
    updateCustomerAddressDto: UpdateCustomerAddressDto,
  ): Promise<string> {
    const finded = await this.findOne(customerId, id);
    if (!finded) {
      throw new NotFoundException(`Customer address ${id} wasn't found!`);
    }
    await this.customerAddressRepository.update(
      {
        id,
      },
      updateCustomerAddressDto,
    );
    return id;
  }

  async delete(customerId: string, id: string): Promise<string> {
    const finded = await this.findOne(customerId, id);
    if (!finded) {
      throw new NotFoundException(`Customer address ${id} wasn't found!`);
    }
    await this.customerAddressRepository.delete({
      id,
    });
    return id;
  }
}
