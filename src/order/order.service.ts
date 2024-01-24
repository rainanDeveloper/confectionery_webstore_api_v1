import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderStatus } from './enum/order-status.enum';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @Inject(CartService)
    private readonly cartService: CartService,
  ) {}

  async create(): Promise<OrderEntity> {
    const createdOrder = this.orderRepository.create({
      status: OrderStatus.OPEN,
    });
    await this.orderRepository.save(createdOrder);
    return createdOrder;
  }

  async createFromCart(cartId: string) {
    const newOrder = await this.create();

    const findedCart = await this.cartService.findOne(cartId, true);

    if (findedCart.customer) {
      newOrder.customer = findedCart.customer;
    }

    newOrder.total = findedCart.total;

    await this.cartService.close(cartId);
  }
}
