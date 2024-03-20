import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethodEntity } from './entities/payment-method.entity';
import { Repository } from 'typeorm';
import { CreatePaymentMethodDto } from './dtos/create-payment-method.dto';

@Injectable()
export class PaymentMethodService {
  constructor(
    @InjectRepository(PaymentMethodEntity)
    private readonly paymentMethodRepository: Repository<PaymentMethodEntity>,
  ) {}

  async create(
    createPaymentMethodDto: CreatePaymentMethodDto,
  ): Promise<string> {
    const paymentMethod = this.paymentMethodRepository.create(
      createPaymentMethodDto,
    );

    await this.paymentMethodRepository.save(paymentMethod);
    return paymentMethod.id;
  }

  async findAll(): Promise<PaymentMethodEntity[]> {
    return await this.paymentMethodRepository.find();
  }

  async findAllWithStatusTrue() {
    return await this.paymentMethodRepository.find({
      where: {
        status: true,
      },
    });
  }
}
