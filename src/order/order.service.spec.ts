import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { OrderStatus } from './enum/order-status.enum';

describe('OrderService', () => {
  let orderService: OrderService;
  let orderRepository: Repository<OrderEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(OrderEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
    orderRepository = module.get<Repository<OrderEntity>>(
      getRepositoryToken(OrderEntity),
    );
  });

  it('should be defined', () => {
    expect(orderService).toBeDefined();
    expect(orderRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a order successfully', async () => {
      const nowMock = new Date();
      const orderMock: OrderEntity = {
        id: randomUUID(),
        itens: [],
        total: 0,
        status: OrderStatus.OPEN,
        createdAt: nowMock,
        updatedAt: nowMock,
      } as OrderEntity;

      jest.spyOn(orderRepository, 'create').mockReturnValueOnce(orderMock);

      const result = await orderService.create();

      expect(result).toStrictEqual(orderMock);
      expect(orderRepository.create).toHaveBeenCalledTimes(1);
      expect(orderRepository.create).toHaveBeenCalledWith({
        status: OrderStatus.OPEN,
      });
      expect(orderRepository.save).toHaveBeenCalledTimes(1);
      expect(orderRepository.save).toHaveBeenCalledWith(orderMock);
    });
  });
});
