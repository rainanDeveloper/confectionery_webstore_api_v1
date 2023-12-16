import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartControllerDto } from './dtos/create-cart-controller.dto';
import { Request } from 'express';
import { CreateCartServiceDto } from './dtos/create-cart-service.dto';
import { ApiTags } from '@nestjs/swagger';
import { OptionalJwtCustomerGuard } from 'src/customer-auth/guards/optional-jwt-customer.guard';
import { CartEntity } from './entities/cart.entity';

@Controller('cart')
@ApiTags('Cart')
@UseGuards(OptionalJwtCustomerGuard)
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

  @Get()
  async findOne(
    @Req() request: Request,
    @Query('id') id: string,
  ): Promise<CartEntity> {
    const user = request.user as any;

    if (user) {
      return this.cartService.findAnyOpenForCustomer(user.id, true);
    }

    return this.cartService.findOne(id, true);
  }
}
