import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerOtpEntity } from './entities/customer-otp.entity';
import { Repository } from 'typeorm';
import { CreateCustomerOtpDto } from './dtos/create-customer-otp.dto';

@Injectable()
export class CustomerOtpService {
  constructor(
    @InjectRepository(CustomerOtpEntity)
    private readonly customerOtpRepository: Repository<CustomerOtpEntity>,
  ) {}

  async create(createCustomerOtpDto: CreateCustomerOtpDto) {
    const createdOtp = this.customerOtpRepository.create(createCustomerOtpDto);

    await this.customerOtpRepository.save(createdOtp);

    return createdOtp;
  }
}
