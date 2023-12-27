import { Test, TestingModule } from '@nestjs/testing';
import { CartCronJobsService } from './cart-cron-jobs.service';
import { CartService } from 'src/cart/cart.service';

describe('CartCronJobsService', () => {
  let cartCronJobsService: CartCronJobsService;
  let cartService: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartCronJobsService,
        {
          provide: CartService,
          useValue: {
            deleteAllClosedNotUpdatedOnLastMonth: jest.fn(),
          },
        },
      ],
    }).compile();

    cartCronJobsService = module.get<CartCronJobsService>(CartCronJobsService);
    cartService = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(cartCronJobsService).toBeDefined();
    expect(cartService).toBeDefined();
  });

  describe('deleteOldClosedCartsJob', () => {
    it('Should execute the service to delete all closed carts within last 30 days', async () => {
      const result = await cartCronJobsService.deleteOldClosedCartsJob();

      expect(result).toBeUndefined();
      expect(
        cartService.deleteAllClosedNotUpdatedOnLastMonth,
      ).toHaveBeenCalledTimes(1);
      expect(
        cartService.deleteAllClosedNotUpdatedOnLastMonth,
      ).toHaveBeenCalledWith();
    });
  });
});
