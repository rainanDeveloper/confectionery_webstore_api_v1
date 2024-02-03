import { BadRequestException, Inject, Injectable } from '@nestjs/common';
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

  async createFromCart(cartId: string, customerId?: string) {
    const findedCart = await this.cartService.findOne(cartId, true);

    if (!findedCart.customer && !customerId)
      throw new BadRequestException(
        'O pedido precisa de um cliente para ser aberto',
      );

    const newOrder = await this.create();

    if (findedCart.customer) {
      newOrder.customer = findedCart.customer;
    }

    if (findedCart.itens.length > 0) {
      newOrder.total = findedCart.total;
      findedCart.itens.forEach((item) => {});
    }

    await this.orderRepository.save(newOrder);

    await this.cartService.close(cartId);
  }

  async findOneOpen(id: string) {
    return await this.orderRepository.findOne({
      where: {
        id,
        status: OrderStatus.OPEN,
      },
    });
  }
}
