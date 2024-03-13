import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { FindOneOptions, LessThan, Repository } from 'typeorm';
import { CreateCartItemDto } from 'src/cart-item/dtos/create-cart-item.dto';
import { CreateCartServiceDto } from './dtos/create-cart-service.dto';
import { CreateCartDto } from './dtos/create-cart.dto';
import { CartStatus } from './enums/cart-status.enum';
import { CartItemService } from 'src/cart-item/cart-item.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    @Inject(forwardRef(() => CartItemService))
    private readonly cartItemService: CartItemService,
  ) {}

  async create(createCartDto: CreateCartServiceDto): Promise<string> {
    const newCartDto: CreateCartDto = {
      total: 0,
      status: CartStatus.OPEN,
    };

    if (createCartDto.customer && createCartDto.customer.id) {
      const existentOpenCartForUser = await this.findAnyOpenForCustomer(
        createCartDto.customer.id,
        false,
      );

      if (existentOpenCartForUser)
        throw new ConflictException(
          `O cliente informado já possui um carinho em aberto`,
        );

      newCartDto.customer = createCartDto.customer;
    }
    const newCart = this.cartRepository.create(newCartDto);

    try {
      await this.cartRepository.save(newCart);
    } catch (error) {
      throw new InternalServerErrorException({
        message: `Erro durante a criação do carrinho`,
        error,
      });
    }

    const itens = await Promise.all(
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
    newCart.total = itens.reduce(
      (prevTotal, currentItem) => prevTotal + currentItem.total,
      0,
    );

    try {
      await this.cartRepository.save(newCart);
    } catch (error) {
      throw new InternalServerErrorException({
        message: `Erro durante a atualização do total do carrinho`,
        error,
      });
    }

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
      findOneOptions.relations = ['itens', 'itens.product'];
    }

    return await this.cartRepository.findOne(findOneOptions);
  }

  async findAnyOpenForCustomer(customerId: string, includeItens: boolean) {
    const findOneOptions: FindOneOptions<CartEntity> = {
      where: {
        customer: {
          id: customerId,
        },
        status: CartStatus.OPEN,
      },
    };

    if (includeItens) {
      findOneOptions.relations = ['itens'];
    }

    return await this.cartRepository.findOne(findOneOptions);
  }

  async findAllClosedSavedBefore(date: Date) {
    return this.cartRepository.find({
      where: {
        updatedAt: LessThan(date),
        status: CartStatus.CLOSED,
      },
    });
  }

  async findAllOpenSavedBefore(date: Date) {
    return this.cartRepository.find({
      where: {
        updatedAt: LessThan(date),
        status: CartStatus.OPEN,
      },
    });
  }

  async updateTotal(id: string) {
    const existentCart = await this.findOne(id, true);

    if (existentCart.itens.length == 0) {
      await this.cartRepository.delete({
        id: existentCart.id,
      });
      return;
    }

    existentCart.total = existentCart.itens.reduce(
      (prevTotal, currentItem) => Number(prevTotal) + Number(currentItem.total),
      0,
    );
    await this.cartRepository.save(existentCart);
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

  async deleteAllClosedNotUpdatedOnLastMonth() {
    const now = new Date();

    const lastMonthDate = new Date();

    lastMonthDate.setMonth(now.getMonth() - 1);

    const carts = await this.findAllClosedSavedBefore(lastMonthDate);

    if (carts.length <= 0) return;

    await Promise.all(
      carts.map((cart) => {
        return this.delete(cart.id);
      }),
    );
  }

  async deleteAllOpenNotUpdatedOnLastThreeMonths() {
    const now = new Date();

    const lastMonthDate = new Date();

    lastMonthDate.setMonth(now.getMonth() - 3);

    const carts = await this.findAllOpenSavedBefore(lastMonthDate);

    if (carts.length <= 0) return;

    await Promise.all(
      carts.map((cart) => {
        return this.delete(cart.id);
      }),
    );
  }

  async delete(id: string) {
    const cart = await this.findOne(id, true);

    if (cart.itens.length > 0) {
      await Promise.all(
        // wait itens deletion
        cart.itens.map((item) => {
          return this.cartItemService.delete(item.id);
        }),
      );
    }

    await this.cartRepository.delete({
      id,
    });
  }
}
