import { Module } from '@nestjs/common';
import { CartCronJobsService } from './cart-cron-jobs.service';

@Module({
  providers: [CartCronJobsService]
})
export class CartCronJobsModule {}
