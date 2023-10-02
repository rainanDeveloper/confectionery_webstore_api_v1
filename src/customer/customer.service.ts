import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { CustomerEntity } from './entities/customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

  async create(customerDto: CreateCustomerDto): Promise<string> {
    const newUser = this.customerRepository.create(customerDto);

    await this.customerRepository.save(newUser);

    return newUser.id;
  }
}
