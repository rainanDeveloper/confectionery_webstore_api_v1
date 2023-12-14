import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItemEntity } from './entities/cart-item.entity';
import { Repository } from 'typeorm';
import { CreateCartItemDto } from './dtos/create-cart-item.dto';
import { ProductService } from 'src/product/product.service';
import { NewCartItemDto } from './dtos/new-cart-item.dto';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItemEntity)
    private readonly cartItemRepository: Repository<CartItemEntity>,
    @Inject(ProductService) private readonly productService: ProductService,
    @Inject(forwardRef(() => CartService))
    private readonly cartService: CartService,
  ) {}

  async create(createCartItemDto: CreateCartItemDto): Promise<CartItemEntity> {
    const existentCart = await this.cartService.findOne(
      createCartItemDto.cart.id,
      false,
    );

    if (!existentCart) {
      throw new NotFoundException(
        `Cart ${createCartItemDto.cart.id} not found`,
      );
    }

    const existentProduct = await this.productService.findOne(
      createCartItemDto.product.id,
    );

    if (!existentProduct)
      throw new NotFoundException(
        `Product ${createCartItemDto.product.id} not found`,
      );

    if (
      existentProduct.stockAmount - existentProduct.stockReservedAmount <
      createCartItemDto.quantity
    )
      throw new BadRequestException(
        `Product ${createCartItemDto.product.id} has not enough itens in stock to add this much (${createCartItemDto.quantity}) to a cart`,
      );

    const newCartItemDto: NewCartItemDto = {
      ...createCartItemDto,
      unitValue: existentProduct.unitValue,
      total: existentProduct.unitValue * createCartItemDto.quantity,
    };

    const newItem = this.cartItemRepository.create(newCartItemDto);

    try {
      await this.cartItemRepository.save(newItem);
    } catch (error) {
      return undefined;
    }

    return newItem;
  }
}
