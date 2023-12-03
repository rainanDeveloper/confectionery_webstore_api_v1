import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateCartDto } from './dtos/create-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
  ) {}

  async create(createCartDto: CreateCartDto) {
    // Need implementation, but we will need to implement first method to find product by id, and cart item insertion
    return;
  }

  async findOne(id: string, includeItens: boolean): Promise<CartEntity> {
    const findOneOptions: FindOneOptions = {
      where: {
        id,
      },
    };
    if (includeItens) {
      findOneOptions.relations = ['itens'];
    }

    return await this.cartRepository.findOne(findOneOptions);
  }
}
