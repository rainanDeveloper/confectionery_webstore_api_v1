import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemService } from './order-item.service';
import { Repository } from 'typeorm';
import { OrderItemEntity } from './entities/order-item.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateOrderItemDto } from './dtos/create-order-item.dto';
import { randomUUID } from 'crypto';
import { ProductService } from 'src/product/product.service';
import { OrderService } from 'src/order/order.service';
import { ProductEntity } from 'src/product/entities/product.entity';

describe('OrderItemService', () => {
  let orderItemService: OrderItemService;
  let orderItemRepository: Repository<OrderItemEntity>;
  let productService: ProductService;
  let orderService: OrderService;

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
        {
          provide: ProductService,
          useValue: {
            findOne: jest.fn(),
            reserveAmount: jest.fn(),
          },
        },
        {
          provide: OrderService,
          useValue: {
            findOneOpen: jest.fn(),
          },
        },
      ],
    }).compile();

    orderItemService = module.get<OrderItemService>(OrderItemService);
    orderItemRepository = module.get<Repository<OrderItemEntity>>(
      getRepositoryToken(OrderItemEntity),
    );
    productService = module.get<ProductService>(ProductService);
    orderService = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(orderItemService).toBeDefined();
    expect(orderItemRepository).toBeDefined();
    expect(productService).toBeDefined();
    expect(orderService).toBeDefined();
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

      const productEntityMock: ProductEntity = {
        id: createOrderItemDto.product.id,
        unitValue: 10,
      } as ProductEntity;

      jest
        .spyOn(productService, 'findOne')
        .mockResolvedValueOnce(productEntityMock);
      jest
        .spyOn(orderItemRepository, 'create')
        .mockReturnValueOnce(orderItemMock);

      const item = await orderItemService.create(createOrderItemDto, true);

      expect(item).toStrictEqual({
        ...orderItemMock,
        unitValue: 10,
        total: 20,
      });
      expect(orderItemRepository.create).toHaveBeenCalledTimes(1);
      expect(orderItemRepository.save).toHaveBeenCalledTimes(1);
    });
  });
});
