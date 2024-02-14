import {
  Controller,
  Inject,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Request } from 'express';
import { OptionalJwtCustomerGuard } from 'src/customer-auth/guards/optional-jwt-customer.guard';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('order')
@ApiTags('Order')
@UseGuards(OptionalJwtCustomerGuard)
@ApiBearerAuth()
export class OrderController {
  constructor(
    @Inject(OrderService) private readonly orderService: OrderService,
  ) {}

  @Post(':cartId')
  @ApiParam({ name: 'cartId' })
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
