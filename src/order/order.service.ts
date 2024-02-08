import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderStatus } from './enum/order-status.enum';
import { CartService } from 'src/cart/cart.service';
import { OrderItemService } from 'src/order-item/order-item.service';
import { CreateOrderItemDto } from 'src/order-item/dtos/create-order-item.dto';
import { CustomerEntity } from 'src/customer/entities/customer.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @Inject(CartService)
    private readonly cartService: CartService,
    @Inject(forwardRef(() => OrderItemService))
    private readonly orderItemService: OrderItemService,
  ) {}

  async create(): Promise<OrderEntity> {
    const createdOrder = this.orderRepository.create({
      status: OrderStatus.OPEN,
    });
    await this.orderRepository.save(createdOrder);
    return createdOrder;
  }

  async createFromCart(
    cartId: string,
    customerId: string,
  ): Promise<OrderEntity> {
    const findedCart = await this.cartService.findOne(cartId, true);

    if (!findedCart) {
      throw new NotFoundException(`Carrinho ${cartId} não encontrado!`);
    }

    if (!findedCart.customer && !customerId)
      throw new BadRequestException(
        'O pedido precisa de um cliente para ser aberto',
      );

    const newOrder = await this.create();

    newOrder.customer = {
      id: customerId,
    } as CustomerEntity;

    if (findedCart.itens.length > 0) {
      newOrder.total = findedCart.total;
      const itensPromiseArray = findedCart.itens.map(async (item) => {
        const itemDto: CreateOrderItemDto = {
          product: {
            id: item.product.id,
          },
          order: {
            id: newOrder.id,
          },
          quantity: item.quantity,
        };
        return this.orderItemService.create(itemDto);
      });

      Promise.all(itensPromiseArray);
    }

    await this.orderRepository.save(newOrder);

    await this.cartService.close(cartId);

    return newOrder;
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
