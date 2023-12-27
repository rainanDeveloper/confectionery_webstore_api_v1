import { Test, TestingModule } from '@nestjs/testing';
import { CartCronJobsService } from './cart-cron-jobs.service';
import { CartService } from 'src/cart/cart.service';

describe('CartCronJobsService', () => {
  let cartCronJobsService: CartCronJobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartCronJobsService,
        {
          provide: CartService,
          useValue: {},
        },
      ],
    }).compile();

    cartCronJobsService = module.get<CartCronJobsService>(CartCronJobsService);
  });

  it('should be defined', () => {
    expect(cartCronJobsService).toBeDefined();
  });

  describe('deleteOldClosedCartsJob', () => {
    it('Should execute the service to delete all closed carts within last 30 days', async () => {
      //Arrange
      //Act
      //Assert
    });
  });
});
