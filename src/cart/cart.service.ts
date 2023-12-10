import {
  ConflictException,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateCartItemDto } from 'src/cart-item/dtos/create-cart-item.dto';
import { CreateCartControllerDto } from './dtos/create-cart-controller.dto';
import { CreateCartDto } from './dtos/create-cart.dto';
import { CartStatus } from './enums/cart-status.enum';
import { CartItemService } from 'src/cart-item/cart-item.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    @Inject(CartItemService) private readonly cartItemService: CartItemService,
  ) {}

  async create(createCartDto: CreateCartControllerDto): Promise<string> {
    const newCartDto: CreateCartDto = {
      customer: createCartDto.customer,
      total: 0,
      status: CartStatus.OPEN,
    };
    const newCart = this.cartRepository.create(newCartDto);

    await this.cartRepository.save(newCart);

    const promiseItensResult = await Promise.allSettled(
      createCartDto.itens.map(async (item) => {
        const cartItemDto: CreateCartItemDto = {
          cart: { id: newCart.id },
          product: item.product,
          quantity: item.quantity,
        };

        const newItem = await this.cartItemService.create(cartItemDto);

        return newItem;
      }),
    );

    // Calculate the total of the cart as a sum of the total of the itens
    newCart.total = promiseItensResult
      .map((itemResult) => {
        if (itemResult.status == 'rejected') return;

        return itemResult.value.total;
      })
      .reduce((accumulator, currentTotal) => {
        return accumulator + currentTotal;
      }, 0);

    await this.cartRepository.save(newCart);

    return newCart.id;
  }

  async findOne(id: string, includeItens: boolean): Promise<CartEntity> {
    const findOneOptions: FindOneOptions = {
      where: {
        id,
        status: CartStatus.OPEN,
      },
    };
    if (includeItens) {
      findOneOptions.relations = ['itens'];
    }

    return await this.cartRepository.findOne(findOneOptions);
  }

  async findAnyForCustomer(customerId: string) {
    const findOneOptions: FindOneOptions<CartEntity> = {
      where: {
        customer: {
          id: customerId,
        },
        status: CartStatus.OPEN,
      },
    };

    return await this.cartRepository.findOne(findOneOptions);
  }

  async close(id: string): Promise<string> {
    const existentCart = await this.findOne(id, true);

    if (existentCart.status !== CartStatus.OPEN)
      throw new ConflictException(`Cart ${id} is already closed`);

    if (existentCart.total <= 0)
      throw new UnprocessableEntityException(
        `The cart ${id} has not a valid total, so it cannot be closed`,
      );

    if (existentCart.itens.length == 0)
      throw new UnprocessableEntityException(
        `The cart ${id} doesn't have itens on it, so it cannot be closed`,
      );

    existentCart.status = CartStatus.CLOSED;

    await this.cartRepository.save(existentCart);

    return existentCart.id;
  }
}
