import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';

describe('CartService', () => {
  let cartService: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartService],
    }).compile();

    cartService = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(cartService).toBeDefined();
  });
});
