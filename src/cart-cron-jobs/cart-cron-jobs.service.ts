import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class CartCronJobsService {
  constructor(@Inject(CartService) private readonly cartService: CartService) {}

  @Cron('0 0 */2 * * *') // runs in hours that are multiples of 2
  async deleteOldClosedCartsJob() {}
}
