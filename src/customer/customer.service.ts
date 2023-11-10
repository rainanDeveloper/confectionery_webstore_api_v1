import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
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

  async findOne(id: string): Promise<CustomerEntity> {
    const finded = await this.customerRepository.findOne({
      where: {
        id,
      },
      select: [
        'id',
        'login',
        'email',
        'name',
        'contactPhone',
        'whatsapp',
        'addresses',
      ],
    });

    if (!finded) {
      throw new NotFoundException(`Customer ${id} was not found`);
    }

    return finded;
  }

  async update(id: string, customerDto: UpdateCustomerDto): Promise<string> {
    await this.findOne(id);

    await this.customerRepository.update(
      {
        id,
      },
      customerDto,
    );

    return id;
  }

  async delete(id: string) {
    await this.findOne(id);
    await this.customerRepository.delete({
      id,
    });
  }
}
