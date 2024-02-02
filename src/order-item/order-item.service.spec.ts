import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemService } from './order-item.service';
import { Repository } from 'typeorm';
import { OrderItemEntity } from './entities/order-item.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('OrderItemService', () => {
  let orderItemService: OrderItemService;
  let orderItemRepository: Repository<OrderItemEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderItemService,
        {
          provide: getRepositoryToken(OrderItemEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    orderItemService = module.get<OrderItemService>(OrderItemService);
    orderItemRepository = module.get<Repository<OrderItemEntity>>(
      getRepositoryToken(OrderItemEntity),
    );
  });

  it('should be defined', () => {
    expect(orderItemService).toBeDefined();
    expect(orderItemRepository).toBeDefined();
  });

  describe('create', () => {
    it('', async () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
