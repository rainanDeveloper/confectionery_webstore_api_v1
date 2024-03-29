import { Test, TestingModule } from '@nestjs/testing';
import MockDate from 'mockdate';
import { CartService } from './cart.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { LessThan, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { CreateCartServiceDto } from './dtos/create-cart-service.dto';
import { CartItemService } from 'src/cart-item/cart-item.service';
import { CartItemEntity } from 'src/cart-item/entities/cart-item.entity';
import { CartStatus } from './enums/cart-status.enum';
import { CreateCartDto } from './dtos/create-cart.dto';
import {
  ConflictException,
  InternalServerErrorException,
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
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: CartItemService,
          useValue: {
            create: jest.fn(),
            delete: jest.fn(),
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
    it('should create a new cart with customer', async () => {
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

      jest
        .spyOn(cartService, 'findAnyOpenForCustomer')
        .mockResolvedValueOnce(undefined);

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
      expect(cartService.findAnyOpenForCustomer).toHaveBeenCalledTimes(1);
      expect(cartService.findAnyOpenForCustomer).toHaveBeenCalledWith(
        createCartDto.customer.id,
        false,
      );
      expect(cartRepository.create).toHaveBeenCalledTimes(1);
      expect(cartRepository.create).toHaveBeenCalledWith(newCartDto);
      expect(cartRepository.save).toHaveBeenCalledTimes(2);
      expect(cartRepository.save).toHaveBeenNthCalledWith(1, cartMock);
      expect(cartRepository.save).toHaveBeenNthCalledWith(2, updatedCartMock);
    });

    it('should create a new cart without customer', async () => {
      const createCartDto: CreateCartServiceDto = {
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

      jest
        .spyOn(cartService, 'findAnyOpenForCustomer')
        .mockResolvedValueOnce(undefined);

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
      expect(cartService.findAnyOpenForCustomer).not.toHaveBeenCalled();
      expect(cartRepository.create).toHaveBeenCalledTimes(1);
      expect(cartRepository.create).toHaveBeenCalledWith(newCartDto);
      expect(cartRepository.save).toHaveBeenCalledTimes(2);
      expect(cartRepository.save).toHaveBeenNthCalledWith(1, cartMock);
      expect(cartRepository.save).toHaveBeenNthCalledWith(2, updatedCartMock);
    });

    it('should create a new cart with no itens due to item creation error', async () => {
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

      jest
        .spyOn(cartService, 'findAnyOpenForCustomer')
        .mockResolvedValueOnce(undefined);

      jest.spyOn(cartRepository, 'create').mockReturnValueOnce(cartMock);

      const resultPromise = cartService.create(createCartDto);

      expect(resultPromise)
        .rejects.toThrow(Error)
        .then(() => {
          expect(cartService.findAnyOpenForCustomer).toHaveBeenCalledTimes(1);
          expect(cartService.findAnyOpenForCustomer).toHaveBeenCalledWith(
            createCartDto.customer.id,
            false,
          );
          expect(cartRepository.create).toHaveBeenCalledTimes(1);
          expect(cartRepository.create).toHaveBeenCalledWith(newCartDto);
          expect(cartRepository.save).toHaveBeenCalledTimes(1);
          expect(cartRepository.save).toHaveBeenNthCalledWith(1, cartMock);
        });
    });

    it('should throw a ConflictException due to existent open cart for informed customer', async () => {
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

      const cartMock: CartEntity = {
        id: randomUUID(),
        customer: createCartDto.customer as any,
        status: CartStatus.OPEN,
      } as any;

      jest
        .spyOn(cartItemService, 'create')
        .mockImplementation(itemCreationMockFn); // Mocks implementation of create method

      jest
        .spyOn(cartService, 'findAnyOpenForCustomer')
        .mockResolvedValueOnce(cartMock);

      const resultPromise = cartService.create(createCartDto);

      expect(resultPromise)
        .rejects.toThrow(ConflictException)
        .then(() => {
          expect(cartService.findAnyOpenForCustomer).toHaveBeenCalledTimes(1);
          expect(cartService.findAnyOpenForCustomer).toHaveBeenCalledWith(
            createCartDto.customer.id,
            false,
          );
          expect(cartRepository.create).not.toHaveBeenCalled();
          expect(cartRepository.save).not.toHaveBeenCalled();
        });
    });

    it('should throw a InternalServerErrorException due to cart criation error', async () => {
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

      jest
        .spyOn(cartService, 'findAnyOpenForCustomer')
        .mockResolvedValueOnce(undefined);

      const cartMock: CartEntity = {
        id: randomUUID(),
        customer: createCartDto.customer as any,
        status: CartStatus.OPEN,
      } as any;

      jest.spyOn(cartRepository, 'create').mockReturnValueOnce(cartMock);

      jest.spyOn(cartRepository, 'save').mockRejectedValueOnce(new Error());

      const resultPromise = cartService.create(createCartDto);

      expect(resultPromise)
        .rejects.toThrowError(InternalServerErrorException)
        .then(() => {
          expect(cartService.findAnyOpenForCustomer).toHaveBeenCalledTimes(1);
          expect(cartService.findAnyOpenForCustomer).toHaveBeenCalledWith(
            createCartDto.customer.id,
            false,
          );
          expect(cartRepository.create).toHaveBeenCalledTimes(1);
          expect(cartRepository.create).toHaveBeenCalledWith(newCartDto);
          expect(cartRepository.save).toHaveBeenCalledTimes(1);
          expect(cartRepository.save).toHaveBeenNthCalledWith(1, cartMock);
        });
    });

    it('should throw a InternalServerErrorException due to cart saving error', async () => {
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

      jest
        .spyOn(cartService, 'findAnyOpenForCustomer')
        .mockResolvedValueOnce(undefined);

      const cartMock: CartEntity = {
        id: randomUUID(),
        customer: createCartDto.customer as any,
        status: CartStatus.OPEN,
      } as any;

      const updatedCartMock = {
        ...cartMock,
        total: itensMock
          .map((item) => item.total)
          .reduce((accumulator, currentTotal) => accumulator + currentTotal, 0),
      };

      jest.spyOn(cartRepository, 'create').mockReturnValueOnce(cartMock);

      jest
        .spyOn(cartRepository, 'save')
        .mockResolvedValueOnce({} as any)
        .mockRejectedValueOnce(new Error());

      const resultPromise = cartService.create(createCartDto);

      expect(resultPromise)
        .rejects.toThrowError(InternalServerErrorException)
        .then(() => {
          expect(cartService.findAnyOpenForCustomer).toHaveBeenCalledTimes(1);
          expect(cartService.findAnyOpenForCustomer).toHaveBeenCalledWith(
            createCartDto.customer.id,
            false,
          );
          expect(cartRepository.create).toHaveBeenCalledTimes(1);
          expect(cartRepository.create).toHaveBeenCalledWith(newCartDto);
          expect(cartRepository.save).toHaveBeenCalledTimes(2);
          expect(cartRepository.save).toHaveBeenNthCalledWith(1, cartMock);
          expect(cartRepository.save).toHaveBeenNthCalledWith(
            2,
            updatedCartMock,
          );
        });
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
        relations: ['itens', 'itens.product'],
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

      const result = await cartService.findAnyOpenForCustomer(
        customerId,
        false,
      );

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

  describe('findAllClosedSavedBefore', () => {
    it('should find all the carts updated before informed date', async () => {
      const dateMock = new Date('2022-01-01');

      const cartsMock: CartEntity[] = [
        {
          id: randomUUID(),
          status: CartStatus.CLOSED,
          createdAt: new Date('2021-09-09'),
          updatedAt: new Date('2021-09-09'),
        } as CartEntity,
        {
          id: randomUUID(),
          status: CartStatus.CLOSED,
          createdAt: new Date('2021-03-21'),
          updatedAt: new Date('2021-04-12'),
        } as CartEntity,
      ];

      jest.spyOn(cartRepository, 'find').mockResolvedValueOnce(cartsMock);

      const result = await cartService.findAllClosedSavedBefore(dateMock);

      expect(result).toStrictEqual(cartsMock);
      expect(cartRepository.find).toHaveBeenCalledTimes(1);
      expect(cartRepository.find).toHaveBeenCalledWith({
        where: {
          updatedAt: LessThan(dateMock),
          status: CartStatus.CLOSED,
        },
      });
    });
  });

  describe('findAllOpenSavedBefore', () => {
    it('should find all the carts updated before informed date', async () => {
      const dateMock = new Date('2022-01-02');

      const cartsMock: CartEntity[] = [
        {
          id: randomUUID(),
          status: CartStatus.OPEN,
          createdAt: new Date('2021-09-09'),
          updatedAt: new Date('2021-09-09'),
        } as CartEntity,
        {
          id: randomUUID(),
          status: CartStatus.OPEN,
          createdAt: new Date('2021-03-21'),
          updatedAt: new Date('2021-04-12'),
        } as CartEntity,
      ];

      jest.spyOn(cartRepository, 'find').mockResolvedValueOnce(cartsMock);

      const result = await cartService.findAllOpenSavedBefore(dateMock);

      expect(result).toStrictEqual(cartsMock);
      expect(cartRepository.find).toHaveBeenCalledTimes(1);
      expect(cartRepository.find).toHaveBeenCalledWith({
        where: {
          updatedAt: LessThan(dateMock),
          status: CartStatus.OPEN,
        },
      });
    });
  });

  describe('updateTotal', () => {
    it('should update the total of the informed cart successfully', async () => {
      const id = randomUUID();
      const cartMock: CartEntity = {
        id,
        itens: [
          {
            id: randomUUID(),
            total: 20,
          } as CartItemEntity,
          {
            id: randomUUID(),
            total: 40,
          } as CartItemEntity,
        ],
      } as CartEntity;

      jest.spyOn(cartService, 'findOne').mockResolvedValueOnce(cartMock);

      const result = await cartService.updateTotal(id);

      expect(result).toBeUndefined();
      expect(cartService.findOne).toHaveBeenCalledTimes(1);
      expect(cartService.findOne).toHaveBeenCalledWith(id, true);
      expect(cartRepository.save).toHaveBeenCalledTimes(1);
      expect(cartRepository.save).toHaveBeenCalledWith({
        id,
        itens: cartMock.itens,
        total: 60,
      });
      expect(cartRepository.delete).not.toHaveBeenCalled();
    });

    it('should delete a cart if it has no itens', async () => {
      const id = randomUUID();
      const cartMock: CartEntity = {
        id,
        itens: [],
      } as CartEntity;

      jest.spyOn(cartService, 'findOne').mockResolvedValueOnce(cartMock);

      const result = await cartService.updateTotal(id);

      expect(result).toBeUndefined();
      expect(cartService.findOne).toHaveBeenCalledTimes(1);
      expect(cartService.findOne).toHaveBeenCalledWith(id, true);
      expect(cartRepository.save).not.toHaveBeenCalled();
      expect(cartRepository.delete).toHaveBeenCalledTimes(1);
      expect(cartRepository.delete).toHaveBeenCalledWith({ id });
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

  describe('deleteAllClosedNotUpdatedOnLastMonth', () => {
    it('should delete all closed carts not updated on last month', async () => {
      const mockLastMonth = new Date('2022-01-20');
      MockDate.set('2022-02-20');
      const cartsMock: CartEntity[] = [
        {
          id: randomUUID(),
          itens: [],
          status: CartStatus.CLOSED,
          createdAt: new Date('2021-09-09'),
          updatedAt: new Date('2021-09-09'),
        } as CartEntity,
        {
          id: randomUUID(),
          itens: [],
          status: CartStatus.CLOSED,
          createdAt: new Date('2021-03-21'),
          updatedAt: new Date('2021-04-12'),
        } as CartEntity,
      ];

      jest
        .spyOn(cartService, 'findAllClosedSavedBefore')
        .mockResolvedValueOnce(cartsMock);
      jest.spyOn(cartService, 'delete').mockResolvedValue();
      await cartService.deleteAllClosedNotUpdatedOnLastMonth();

      expect(cartService.findAllClosedSavedBefore).toHaveBeenCalledTimes(1);
      expect(cartService.findAllClosedSavedBefore).toHaveBeenCalledWith(
        mockLastMonth,
      );
      expect(cartService.delete).toHaveBeenCalledTimes(2);
      expect(cartService.delete).toHaveBeenNthCalledWith(1, cartsMock[0].id);
      expect(cartService.delete).toHaveBeenNthCalledWith(2, cartsMock[1].id);
      MockDate.reset();
    });

    it('should return when no carts are found', async () => {
      const mockLastMonth = new Date('2022-01-20');
      MockDate.set('2022-02-20');
      const cartsMock: CartEntity[] = [];

      jest
        .spyOn(cartService, 'findAllClosedSavedBefore')
        .mockResolvedValueOnce(cartsMock);
      jest.spyOn(cartService, 'delete').mockResolvedValue();
      await cartService.deleteAllClosedNotUpdatedOnLastMonth();

      expect(cartService.findAllClosedSavedBefore).toHaveBeenCalledTimes(1);
      expect(cartService.findAllClosedSavedBefore).toHaveBeenCalledWith(
        mockLastMonth,
      );
      expect(cartService.delete).not.toHaveBeenCalled();
      MockDate.reset();
    });
  });

  describe('deleteAllOpenNotUpdatedOnLastThreeMonths', () => {
    it('should delete all open carts not updated on last 3 months', async () => {
      const mockLastThreeMonths = new Date('2022-01-12');
      MockDate.set('2022-04-12');
      const cartsMock: CartEntity[] = [
        {
          id: randomUUID(),
          itens: [],
          status: CartStatus.CLOSED,
          createdAt: new Date('2021-09-09'),
          updatedAt: new Date('2021-09-09'),
        } as CartEntity,
        {
          id: randomUUID(),
          itens: [],
          status: CartStatus.CLOSED,
          createdAt: new Date('2021-03-21'),
          updatedAt: new Date('2021-04-12'),
        } as CartEntity,
      ];

      jest
        .spyOn(cartService, 'findAllOpenSavedBefore')
        .mockResolvedValueOnce(cartsMock);
      jest.spyOn(cartService, 'delete').mockResolvedValue();
      await cartService.deleteAllOpenNotUpdatedOnLastThreeMonths();

      expect(cartService.findAllOpenSavedBefore).toHaveBeenCalledTimes(1);
      expect(cartService.findAllOpenSavedBefore).toHaveBeenCalledWith(
        mockLastThreeMonths,
      );
      expect(cartService.delete).toHaveBeenCalledTimes(2);
      expect(cartService.delete).toHaveBeenNthCalledWith(1, cartsMock[0].id);
      expect(cartService.delete).toHaveBeenNthCalledWith(2, cartsMock[1].id);
      MockDate.reset();
    });

    it('should return when no carts are found', async () => {
      const mockLastMonth = new Date('2022-01-12');
      MockDate.set('2022-04-12');
      const cartsMock: CartEntity[] = [];

      jest
        .spyOn(cartService, 'findAllOpenSavedBefore')
        .mockResolvedValueOnce(cartsMock);
      jest.spyOn(cartService, 'delete').mockResolvedValue();
      await cartService.deleteAllOpenNotUpdatedOnLastThreeMonths();

      expect(cartService.findAllOpenSavedBefore).toHaveBeenCalledTimes(1);
      expect(cartService.findAllOpenSavedBefore).toHaveBeenCalledWith(
        mockLastMonth,
      );
      expect(cartService.delete).not.toHaveBeenCalled();
      MockDate.reset();
    });
  });

  describe('delete', () => {
    it('Deve deletar o carrinho com id informado - um único item', async () => {
      const idMock = randomUUID();

      const cartMock = new CartEntity();
      cartMock.id = idMock;
      cartMock.itens = [
        {
          id: randomUUID(),
        } as CartItemEntity,
      ];

      jest.spyOn(cartService, 'findOne').mockResolvedValueOnce(cartMock);

      const result = await cartService.delete(idMock);

      expect(result).toBeUndefined();
      expect(cartService.findOne).toHaveBeenCalledTimes(1);
      expect(cartService.findOne).toHaveBeenCalledWith(idMock, true);
      expect(cartItemService.delete).toHaveBeenCalledTimes(1);
      expect(cartItemService.delete).toHaveBeenCalledWith(cartMock.itens[0].id);
      expect(cartRepository.delete).toHaveBeenCalledTimes(1);
      expect(cartRepository.delete).toHaveBeenCalledWith({ id: idMock });
    });

    it('Deve deletar o carrinho com id informado - mais de um item', async () => {
      const idMock = randomUUID();

      const cartMock = new CartEntity();
      cartMock.id = idMock;
      cartMock.itens = [
        {
          id: randomUUID(),
        } as CartItemEntity,
        {
          id: randomUUID(),
        } as CartItemEntity,
      ];

      jest.spyOn(cartService, 'findOne').mockResolvedValueOnce(cartMock);

      const result = await cartService.delete(idMock);

      expect(result).toBeUndefined();
      expect(cartService.findOne).toHaveBeenCalledTimes(1);
      expect(cartService.findOne).toHaveBeenCalledWith(idMock, true);
      expect(cartItemService.delete).toHaveBeenCalledTimes(2);
      expect(cartItemService.delete).toHaveBeenNthCalledWith(
        1,
        cartMock.itens[0].id,
      );
      expect(cartItemService.delete).toHaveBeenNthCalledWith(
        2,
        cartMock.itens[1].id,
      );
      expect(cartRepository.delete).toHaveBeenCalledTimes(1);
      expect(cartRepository.delete).toHaveBeenCalledWith({ id: idMock });
    });

    it('Deve deletar o carrinho com id informado - sem itens', async () => {
      const idMock = randomUUID();

      const cartMock = new CartEntity();
      cartMock.id = idMock;
      cartMock.itens = [];

      jest.spyOn(cartService, 'findOne').mockResolvedValueOnce(cartMock);

      const result = await cartService.delete(idMock);

      expect(result).toBeUndefined();
      expect(cartService.findOne).toHaveBeenCalledTimes(1);
      expect(cartService.findOne).toHaveBeenCalledWith(idMock, true);
      expect(cartItemService.delete).not.toHaveBeenCalled();
      expect(cartRepository.delete).toHaveBeenCalledTimes(1);
      expect(cartRepository.delete).toHaveBeenCalledWith({ id: idMock });
    });
  });
});
