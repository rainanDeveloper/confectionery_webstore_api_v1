import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItemEntity } from './entities/order-item.entity';
import { Repository } from 'typeorm';
import { CreateOrderItemDto } from './dtos/create-order-item.dto';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
  ) {}

  async create(createOrderItemDto: CreateOrderItemDto) {
    const item = this.orderItemRepository.create(createOrderItemDto);

    await this.orderItemRepository.save(item);

    return item;
  }
}
