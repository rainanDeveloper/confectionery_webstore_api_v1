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

  async create(
    createCustomerOtpDto: CreateCustomerOtpDto,
  ): Promise<CustomerOtpEntity> {
    const createdOtp = this.customerOtpRepository.create(createCustomerOtpDto);

    await this.customerOtpRepository.save(createdOtp);

    return createdOtp;
  }

  async findOne(otp: string): Promise<CustomerOtpEntity> {
    return await this.customerOtpRepository.findOne({
      where: {
        otp,
      },
    });
  }

  async delete(otp: string) {
    await this.customerOtpRepository.delete({
      otp,
    });
  }
}
