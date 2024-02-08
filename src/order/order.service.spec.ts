import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { OrderStatus } from './enum/order-status.enum';
import { CartService } from 'src/cart/cart.service';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { CartStatus } from 'src/cart/enums/cart-status.enum';
import { CustomerEntity } from 'src/customer/entities/customer.entity';
import { BadRequestException } from '@nestjs/common';
import { OrderItemService } from 'src/order-item/order-item.service';

describe('OrderService', () => {
  let orderService: OrderService;
  let orderRepository: Repository<OrderEntity>;
  let cartService: CartService;
  let orderItemService: OrderItemService;

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
        {
          provide: CartService,
          useValue: {
            findOne: jest.fn(),
            close: jest.fn(),
          },
        },
        {
          provide: OrderItemService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
    orderRepository = module.get<Repository<OrderEntity>>(
      getRepositoryToken(OrderEntity),
    );
    cartService = module.get<CartService>(CartService);
    orderItemService = module.get<OrderItemService>(OrderItemService);
  });

  it('should be defined', () => {
    expect(orderService).toBeDefined();
    expect(orderRepository).toBeDefined();
    expect(cartService).toBeDefined();
    expect(orderItemService).toBeDefined();
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
      expect(orderItemService.create).not.toHaveBeenCalled();
    });
  });

  describe('createFromCart', () => {
    it('should create a order from a informed cart without customer, but informing customer id', async () => {
      const customerId = randomUUID();
      const cartDateMock = new Date('2024-01-12');
      const cartMock: CartEntity = {
        id: randomUUID(),
        itens: [],
        total: 20,
        status: CartStatus.OPEN,
        createdAt: cartDateMock,
        updatedAt: cartDateMock,
      } as CartEntity;

      const nowMock = new Date();
      const newOrder: OrderEntity = {
        id: randomUUID(),
        itens: [],
        total: 0,
        status: OrderStatus.OPEN,
        createdAt: nowMock,
        updatedAt: nowMock,
      } as OrderEntity;

      jest.spyOn(orderService, 'create').mockResolvedValueOnce(newOrder);
      jest.spyOn(cartService, 'findOne').mockResolvedValueOnce(cartMock);

      await orderService.createFromCart(cartMock.id, customerId);

      expect(orderService.create).toHaveBeenCalledTimes(1);
      expect(orderService.create).toHaveBeenCalledWith();
      expect(cartService.findOne).toHaveBeenCalledTimes(1);
      expect(cartService.findOne).toHaveBeenCalledWith(cartMock.id, true);
      expect(cartService.close).toHaveBeenCalledWith(cartMock.id);
      expect(cartService.close).toHaveBeenCalledTimes(1);
      expect(orderItemService.create).not.toHaveBeenCalled();
    });

    it('should create a order from a informed cart with customer', async () => {
      const customerMock: CustomerEntity = {
        id: randomUUID(),
      } as CustomerEntity;
      const cartDateMock = new Date('2024-01-12');
      const cartMock: CartEntity = {
        id: randomUUID(),
        customer: customerMock,
        itens: [],
        total: 20,
        status: CartStatus.OPEN,
        createdAt: cartDateMock,
        updatedAt: cartDateMock,
      } as CartEntity;

      const nowMock = new Date();
      const newOrder: OrderEntity = {
        id: randomUUID(),
        itens: [],
        total: 0,
        status: OrderStatus.OPEN,
        createdAt: nowMock,
        updatedAt: nowMock,
      } as OrderEntity;

      jest.spyOn(orderService, 'create').mockResolvedValueOnce(newOrder);
      jest.spyOn(cartService, 'findOne').mockResolvedValueOnce(cartMock);

      await orderService.createFromCart(cartMock.id);

      expect(orderService.create).toHaveBeenCalledTimes(1);
      expect(orderService.create).toHaveBeenCalledWith();
      expect(cartService.findOne).toHaveBeenCalledTimes(1);
      expect(cartService.findOne).toHaveBeenCalledWith(cartMock.id, true);
      expect(cartService.close).toHaveBeenCalledWith(cartMock.id);
      expect(cartService.close).toHaveBeenCalledTimes(1);
      expect(orderItemService.create).not.toHaveBeenCalled();
    });

    it('should throw a BadRequestException due to no customer is informed whatsoever', async () => {
      const cartDateMock = new Date('2024-01-12');
      const cartMock: CartEntity = {
        id: randomUUID(),
        itens: [],
        total: 20,
        status: CartStatus.OPEN,
        createdAt: cartDateMock,
        updatedAt: cartDateMock,
      } as CartEntity;

      const nowMock = new Date();
      const newOrder: OrderEntity = {
        id: randomUUID(),
        itens: [],
        total: 0,
        status: OrderStatus.OPEN,
        createdAt: nowMock,
        updatedAt: nowMock,
      } as OrderEntity;

      jest.spyOn(orderService, 'create').mockResolvedValueOnce(newOrder);
      jest.spyOn(cartService, 'findOne').mockResolvedValueOnce(cartMock);

      const resultPromise = orderService.createFromCart(cartMock.id);

      expect(resultPromise)
        .rejects.toThrow(BadRequestException)
        .then(() => {
          expect(orderService.create).not.toHaveBeenCalled();
          expect(cartService.findOne).toHaveBeenCalledTimes(1);
          expect(cartService.findOne).toHaveBeenCalledWith(cartMock.id, true);
          expect(cartService.close).not.toHaveBeenCalled();
          expect(orderItemService.create).not.toHaveBeenCalled();
        });
    });
  });
});
