import {
  Controller,
  Inject,
  Param,
  Post,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Request } from 'express';

@Controller('order')
export class OrderController {
  constructor(
    @Inject(OrderService) private readonly orderService: OrderService,
  ) {}

  @Post(':cartId')
  async create(@Param('cartId') cartId, @Req() request: Request) {
    const user = request.user as any;
    if (!user) {
      throw new UnauthorizedException(
        'É necessário estar autenticado para fechar um pedido',
      );
    }

    return await this.orderService.createFromCart(cartId, user.id);
  }
}
