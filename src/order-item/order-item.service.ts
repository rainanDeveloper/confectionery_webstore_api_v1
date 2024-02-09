import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItemEntity } from './entities/order-item.entity';
import { Repository } from 'typeorm';
import { CreateOrderItemDto } from './dtos/create-order-item.dto';
import { ProductService } from 'src/product/product.service';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
    @Inject(ProductService) private readonly productService: ProductService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
  ) {}

  async create(
    createOrderItemDto: CreateOrderItemDto,
    ignoreOrderDbCheck = false,
  ) {
    if (!ignoreOrderDbCheck) {
      const existentOrder = await this.orderService.findOneOpen(
        createOrderItemDto.order.id,
      );

      if (!existentOrder) {
        throw new NotFoundException(
          `Pedido ${createOrderItemDto.order.id} não foi encontrado!`,
        );
      }
    }

    const existentProduct = await this.productService.findOne(
      createOrderItemDto.product.id,
    );

    if (!existentProduct) {
      throw new NotFoundException(
        `Pedido ${createOrderItemDto.order.id} não foi encontrado!`,
      );
    }

    const item = this.orderItemRepository.create(createOrderItemDto);

    item.unitValue = existentProduct.unitValue;
    item.total = existentProduct.unitValue * item.quantity;

    const reserveAmountPromise = this.productService.reserveAmount(
      createOrderItemDto.product.id,
      item.quantity,
    );

    const itemCreationPromise = this.orderItemRepository.save(item);

    await Promise.all([reserveAmountPromise, itemCreationPromise]);

    return item;
  }
  async delete(id: string) {
    throw new Error('Method not implemented.');
  }
}
