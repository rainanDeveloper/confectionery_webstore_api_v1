import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { CreateCartServiceDto } from './dtos/create-cart-service.dto';
import { CartItemService } from 'src/cart-item/cart-item.service';
import { CartItemEntity } from 'src/cart-item/entities/cart-item.entity';
import { CartStatus } from './enums/cart-status.enum';
import { CreateCartDto } from './dtos/create-cart.dto';
import {
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';

describe('CartService', () => {
  let cartService: CartService;
  let cartRepository: Repository<CartEntity>;
  let cartItemService: CartItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(CartEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: CartItemService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    cartService = module.get<CartService>(CartService);
    cartRepository = module.get<Repository<CartEntity>>(
      getRepositoryToken(CartEntity),
    );
    cartItemService = module.get<CartItemService>(CartItemService);
  });

  it('should be defined', () => {
    expect(cartService).toBeDefined();
    expect(cartRepository).toBeDefined();
    expect(cartItemService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new cart', async () => {
      const createCartDto: CreateCartServiceDto = {
        customer: {
          id: randomUUID(),
        },
        itens: [
          {
            product: {
              id: randomUUID(),
            },
            quantity: 1,
          },
          {
            product: {
              id: randomUUID(),
            },
            quantity: 2,
          },
        ],
      };

      const newCartDto: CreateCartDto = {
        customer: createCartDto.customer,
        total: 0,
        status: CartStatus.OPEN,
      };

      const itensPriceMock = Math.round(100 * 10000 * Math.random()) / 1000; // Creates a 4 decimal price for all itens

      const itemCreationMockFn = async (itemDto) => {
        const newItem = new CartItemEntity();
        newItem.id = randomUUID();
        newItem.unitValue = itensPriceMock;
        newItem.total = itensPriceMock * itemDto.quantity;
        newItem.quantity = itemDto.quantity;
        newItem.product = itemDto.product as any;

        return newItem;
      };

      const itensMock = await Promise.all(
        createCartDto.itens.map(itemCreationMockFn),
      );

      jest
        .spyOn(cartItemService, 'create')
        .mockImplementation(itemCreationMockFn); // Mocks implementation of create method

      const cartMock: CartEntity = {
        id: randomUUID(),
        customer: createCartDto.customer as any,
        status: CartStatus.OPEN,
      } as any;

      jest.spyOn(cartRepository, 'create').mockReturnValueOnce(cartMock);

      const updatedCartMock = {
        ...cartMock,
        total: itensMock
          .map((item) => item.total)
          .reduce((accumulator, currentTotal) => accumulator + currentTotal, 0),
      };

      const result = await cartService.create(createCartDto);

      expect(result).toStrictEqual(cartMock.id);
      expect(cartRepository.create).toHaveBeenCalledTimes(1);
      expect(cartRepository.create).toHaveBeenCalledWith(newCartDto);
      expect(cartRepository.save).toHaveBeenCalledTimes(2);
      expect(cartRepository.save).toHaveBeenNthCalledWith(1, cartMock);
      expect(cartRepository.save).toHaveBeenNthCalledWith(2, updatedCartMock);
    });

    it('should create a new cart', async () => {
      const createCartDto: CreateCartServiceDto = {
        customer: {
          id: randomUUID(),
        },
        itens: [
          {
            product: {
              id: randomUUID(),
            },
            quantity: 1,
          },
          {
            product: {
              id: randomUUID(),
            },
            quantity: 2,
          },
        ],
      };

      const newCartDto: CreateCartDto = {
        customer: createCartDto.customer,
        total: 0,
        status: CartStatus.OPEN,
      };

      jest.spyOn(cartItemService, 'create').mockRejectedValue(new Error());

      const cartMock: CartEntity = {
        id: randomUUID(),
        customer: createCartDto.customer as any,
        status: CartStatus.OPEN,
      } as any;

      jest.spyOn(cartRepository, 'create').mockReturnValueOnce(cartMock);

      const result = await cartService.create(createCartDto);

      expect(result).toStrictEqual(cartMock.id);
      expect(cartRepository.create).toHaveBeenCalledTimes(1);
      expect(cartRepository.create).toHaveBeenCalledWith(newCartDto);
      expect(cartRepository.save).toHaveBeenCalledTimes(2);
      expect(cartRepository.save).toHaveBeenNthCalledWith(1, cartMock);
      expect(cartRepository.save).toHaveBeenNthCalledWith(2, cartMock);
    });
  });

  describe('findOne', () => {
    it('should find a cart successfully', async () => {
      const cartId = randomUUID();
      const cartMock = new CartEntity();

      jest.spyOn(cartRepository, 'findOne').mockResolvedValueOnce(cartMock);

      const result = await cartService.findOne(cartId, true);

      expect(result).toStrictEqual(cartMock);
      expect(cartRepository.findOne).toHaveBeenCalledTimes(1);
      expect(cartRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: cartId,
          status: CartStatus.OPEN,
        },
        relations: ['itens'],
      });
    });

    it('should find a cart successfully without including itens', async () => {
      const cartId = randomUUID();
      const cartMock = new CartEntity();

      jest.spyOn(cartRepository, 'findOne').mockResolvedValueOnce(cartMock);

      const result = await cartService.findOne(cartId, false);

      expect(result).toStrictEqual(cartMock);
      expect(cartRepository.findOne).toHaveBeenCalledTimes(1);
      expect(cartRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: cartId,
          status: CartStatus.OPEN,
        },
      });
    });
  });

  describe('findAnyOpenForCustomer', () => {
    it('should find a customer successfully', async () => {
      const customerId = randomUUID();
      const cartMock = new CartEntity();

      jest.spyOn(cartRepository, 'findOne').mockResolvedValueOnce(cartMock);

      const result = await cartService.findAnyOpenForCustomer(customerId);

      expect(result).toStrictEqual(cartMock);
      expect(cartRepository.findOne).toHaveBeenCalledTimes(1);
      expect(cartRepository.findOne).toHaveBeenCalledWith({
        where: {
          customer: {
            id: customerId,
          },
          status: CartStatus.OPEN,
        },
      });
    });
  });

  describe('close', () => {
    it('should close a open cart successfully', async () => {
      const nowMock = new Date();
      const cartIdMock = randomUUID();
      const cartMock: CartEntity = {
        id: cartIdMock,
        itens: [
          {
            id: randomUUID(),
          },
        ],
        total: 10,
        status: CartStatus.OPEN,
        createdAt: nowMock,
        updatedAt: nowMock,
      } as CartEntity;

      jest.spyOn(cartService, 'findOne').mockResolvedValueOnce(cartMock);

      const result = await cartService.close(cartIdMock);

      expect(result).toStrictEqual(cartIdMock);
      expect(cartService.findOne).toHaveBeenCalledTimes(1);
      expect(cartService.findOne).toHaveBeenCalledWith(cartIdMock, true);
      expect(cartRepository.save).toHaveBeenCalledTimes(1);
      expect(cartRepository.save).toHaveBeenCalledWith({
        ...cartMock,
        status: CartStatus.CLOSED,
      });
    });

    it('should throw a conflict exception when trying to close a cart that already is closed', async () => {
      const nowMock = new Date();
      const cartIdMock = randomUUID();
      const cartMock: CartEntity = {
        id: cartIdMock,
        itens: [
          {
            id: randomUUID(),
          },
        ],
        total: 10,
        status: CartStatus.CLOSED,
        createdAt: nowMock,
        updatedAt: nowMock,
      } as CartEntity;

      jest.spyOn(cartService, 'findOne').mockResolvedValueOnce(cartMock);

      const resultPromise = cartService.close(cartIdMock);

      expect(resultPromise)
        .rejects.toThrowError(ConflictException)
        .then(() => {
          expect(cartService.findOne).toHaveBeenCalledTimes(1);
          expect(cartService.findOne).toHaveBeenCalledWith(cartIdMock, true);
          expect(cartRepository.save).not.toHaveBeenCalled();
        });
    });

    it('should throw a unprocessable entity exception when the total is equal zero', async () => {
      const nowMock = new Date();
      const cartIdMock = randomUUID();
      const cartMock: CartEntity = {
        id: cartIdMock,
        itens: [
          {
            id: randomUUID(),
          },
        ],
        total: 0,
        status: CartStatus.OPEN,
        createdAt: nowMock,
        updatedAt: nowMock,
      } as CartEntity;

      jest.spyOn(cartService, 'findOne').mockResolvedValueOnce(cartMock);

      const resultPromise = cartService.close(cartIdMock);

      expect(resultPromise)
        .rejects.toThrowError(UnprocessableEntityException)
        .then(() => {
          expect(cartService.findOne).toHaveBeenCalledTimes(1);
          expect(cartService.findOne).toHaveBeenCalledWith(cartIdMock, true);
          expect(cartRepository.save).not.toHaveBeenCalled();
        });
    });

    it('should throw a unprocessable entity exception when the total is less than zero', async () => {
      const nowMock = new Date();
      const cartIdMock = randomUUID();
      const cartMock: CartEntity = {
        id: cartIdMock,
        itens: [
          {
            id: randomUUID(),
          },
        ],
        total: -20,
        status: CartStatus.OPEN,
        createdAt: nowMock,
        updatedAt: nowMock,
      } as CartEntity;

      jest.spyOn(cartService, 'findOne').mockResolvedValueOnce(cartMock);

      const resultPromise = cartService.close(cartIdMock);

      expect(resultPromise)
        .rejects.toThrowError(UnprocessableEntityException)
        .then(() => {
          expect(cartService.findOne).toHaveBeenCalledTimes(1);
          expect(cartService.findOne).toHaveBeenCalledWith(cartIdMock, true);
          expect(cartRepository.save).not.toHaveBeenCalled();
        });
    });

    it('should throw a unprocessable entity exception when amount of itens is zero', async () => {
      const nowMock = new Date();
      const cartIdMock = randomUUID();
      const cartMock: CartEntity = {
        id: cartIdMock,
        itens: [],
        total: 10,
        status: CartStatus.OPEN,
        createdAt: nowMock,
        updatedAt: nowMock,
      } as CartEntity;

      jest.spyOn(cartService, 'findOne').mockResolvedValueOnce(cartMock);

      const resultPromise = cartService.close(cartIdMock);

      expect(resultPromise)
        .rejects.toThrowError(UnprocessableEntityException)
        .then(() => {
          expect(cartService.findOne).toHaveBeenCalledTimes(1);
          expect(cartService.findOne).toHaveBeenCalledWith(cartIdMock, true);
          expect(cartRepository.save).not.toHaveBeenCalled();
        });
    });
  });
});
