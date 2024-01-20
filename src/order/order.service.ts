import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderStatus } from './enum/order-status.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  async create(): Promise<OrderEntity> {
    const createdOrder = this.orderRepository.create({
      status: OrderStatus.OPEN,
    });
    await this.orderRepository.save(createdOrder);
    return createdOrder;
  }
}
