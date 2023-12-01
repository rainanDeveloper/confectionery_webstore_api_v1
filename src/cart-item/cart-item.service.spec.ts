import { Test, TestingModule } from '@nestjs/testing';
import { CartItemService } from './cart-item.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartItemEntity } from './entities/cart-item.entity';
import { Repository } from 'typeorm';

describe('CartItemService', () => {
  let cartItemService: CartItemService;
  let cartItemRepository: Repository<CartItemEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartItemService,
        {
          provide: getRepositoryToken(CartItemEntity),
          useValue: {},
        },
      ],
    }).compile();

    cartItemService = module.get<CartItemService>(CartItemService);
    cartItemRepository = module.get<Repository<CartItemEntity>>(
      getRepositoryToken(CartItemEntity),
    );
  });

  it('should be defined', () => {
    expect(cartItemService).toBeDefined();
    expect(cartItemRepository).toBeDefined();
  });
});
