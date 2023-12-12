import { Body, Controller, Inject, Post, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartControllerDto } from './dtos/create-cart-controller.dto';
import { Request } from 'express';
import { CreateCartServiceDto } from './dtos/create-cart-service.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('cart')
@ApiTags('Cart')
export class CartController {
  constructor(@Inject(CartService) private readonly cartService: CartService) {}

  @Post()
  async create(
    @Req() request: Request,
    @Body() createCartControllerDto: CreateCartControllerDto,
  ) {
    const user = request.user as any;

    const createCartServiceDto: CreateCartServiceDto = {
      itens: createCartControllerDto.itens,
    };

    if (user) {
      createCartServiceDto.customer = {
        id: user.id,
      };
    }

    const cartId = await this.cartService.create(createCartServiceDto);

    return { id: cartId };
  }
}
