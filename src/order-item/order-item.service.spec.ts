import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemService } from './order-item.service';
import { Repository } from 'typeorm';
import { OrderItemEntity } from './entities/order-item.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateOrderItemDto } from './dtos/create-order-item.dto';
import { randomUUID } from 'crypto';

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
    it('should create a order item', async () => {
      const nowMock = new Date();
      const createOrderItemDto: CreateOrderItemDto = {
        product: {
          id: randomUUID(),
        },
        order: {
          id: randomUUID(),
        },
        quantity: 2,
      };

      const orderItemMock: OrderItemEntity = {
        product: createOrderItemDto.product,
        order: createOrderItemDto.order,
        quantity: 2,
        createdAt: nowMock,
        updatedAt: nowMock,
      } as OrderItemEntity;

      jest
        .spyOn(orderItemRepository, 'create')
        .mockReturnValueOnce(orderItemMock);

      const item = await orderItemService.create(createOrderItemDto);

      expect(item).toStrictEqual(orderItemMock);
      expect(orderItemRepository.create).toHaveBeenCalledTimes(1);
      expect(orderItemRepository.save).toHaveBeenCalledTimes(1);
    });
  });
});
