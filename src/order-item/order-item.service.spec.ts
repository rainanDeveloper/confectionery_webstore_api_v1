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
import { OrderEntity } from 'src/order/entities/order.entity';
import { NotFoundException } from '@nestjs/common';

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

      const orderEntityMock: OrderEntity = {
        id: createOrderItemDto.order.id,
      } as OrderEntity;

      jest
        .spyOn(productService, 'findOne')
        .mockResolvedValueOnce(productEntityMock);
      jest
        .spyOn(orderService, 'findOneOpen')
        .mockResolvedValueOnce(orderEntityMock);
      jest
        .spyOn(orderItemRepository, 'create')
        .mockReturnValueOnce(orderItemMock);

      const item = await orderItemService.create(createOrderItemDto);

      expect(item).toStrictEqual({
        ...orderItemMock,
        unitValue: 10,
        total: 20,
      });
      expect(orderItemRepository.create).toHaveBeenCalledTimes(1);
      expect(orderItemRepository.create).toHaveBeenCalledWith(
        createOrderItemDto,
      );
      expect(productService.findOne).toHaveBeenCalledTimes(1);
      expect(productService.findOne).toHaveBeenCalledWith(
        createOrderItemDto.product.id,
      );
      expect(orderService.findOneOpen).toHaveBeenCalledTimes(1);
      expect(orderService.findOneOpen).toHaveBeenCalledWith(
        createOrderItemDto.order.id,
      );
      expect(productService.reserveAmount).toHaveBeenCalledTimes(1);
      expect(productService.reserveAmount).toHaveBeenCalledWith(
        createOrderItemDto.product.id,
        createOrderItemDto.quantity,
      );
      expect(orderItemRepository.save).toHaveBeenCalledTimes(1);
      expect(orderItemRepository.save).toHaveBeenCalledWith({
        ...orderItemMock,
        unitValue: 10,
        total: 20,
      });
    });

    it('should throw a error', async () => {
      const createOrderItemDto: CreateOrderItemDto = {
        product: {
          id: randomUUID(),
        },
        order: {
          id: randomUUID(),
        },
        quantity: 2,
      };

      const productEntityMock: ProductEntity = {
        id: createOrderItemDto.product.id,
        unitValue: 10,
      } as ProductEntity;

      jest
        .spyOn(productService, 'findOne')
        .mockResolvedValueOnce(productEntityMock);

      const resultPromise = orderItemService.create(createOrderItemDto);

      expect(resultPromise)
        .rejects.toThrow(NotFoundException)
        .then(() => {
          expect(orderItemRepository.create).not.toHaveBeenCalled();
          expect(productService.findOne).not.toHaveBeenCalled();
          expect(orderService.findOneOpen).toHaveBeenCalledTimes(1);
          expect(orderService.findOneOpen).toHaveBeenCalledWith(
            createOrderItemDto.order.id,
          );
          expect(productService.reserveAmount).not.toHaveBeenCalled();
          expect(orderItemRepository.save).not.toHaveBeenCalled();
        });
    });
  });
});
