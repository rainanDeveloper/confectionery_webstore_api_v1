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
        `Carrinho ${createCartItemDto.cart.id} não encontrado`,
      );
    }

    const existentProduct = await this.productService.findOne(
      createCartItemDto.product.id,
    );

    if (!existentProduct)
      throw new NotFoundException(
        `Produto ${createCartItemDto.product.id} não encontrado`,
      );

    if (
      existentProduct.stockAmount - existentProduct.stockReservedAmount <
      createCartItemDto.quantity
    )
      throw new BadRequestException(
        `Produto ${createCartItemDto.product.id} não possui estoque suficiente para adicionar ${createCartItemDto.quantity} itens ao carrinho`,
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

  async findOneByIdAndCart(id: string, cartId: string) {
    return await this.cartItemRepository.findOne({
      where: {
        id,
        cart: {
          id: cartId,
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.cartItemRepository.delete({
      id,
    });
  }
}
