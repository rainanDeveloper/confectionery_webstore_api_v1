import { Module } from '@nestjs/common';
import { CartCronJobsService } from './cart-cron-jobs.service';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [CartModule],
  providers: [CartCronJobsService]
})
export class CartCronJobsModule {}
