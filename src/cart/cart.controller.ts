import { Controller, Inject } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(@Inject(CartService) private readonly cartService) {}
}
