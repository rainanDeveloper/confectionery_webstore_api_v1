import { Test, TestingModule } from '@nestjs/testing';
import { CartCronJobsService } from './cart-cron-jobs.service';

describe('CartCronJobsService', () => {
  let cartCronJobsService: CartCronJobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartCronJobsService],
    }).compile();

    cartCronJobsService = module.get<CartCronJobsService>(CartCronJobsService);
  });

  it('should be defined', () => {
    expect(cartCronJobsService).toBeDefined();
  });
});
