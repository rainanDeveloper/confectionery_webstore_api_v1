import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CreateCartControllerDto } from './dtos/create-cart-controller.dto';
import { randomUUID } from 'crypto';
import { CartEntity } from './entities/cart.entity';
import { CartStatus } from './enums/cart-status.enum';
import { Request } from 'express';
import { CustomerEntity } from 'src/customer/entities/customer.entity';

describe('CartController', () => {
  let cartController: CartController;
  let cartService: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findAnyOpenForCustomer: jest.fn(),
          },
        },
      ],
    }).compile();

    cartController = module.get<CartController>(CartController);
    cartService = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(cartController).toBeDefined();
    expect(cartService).toBeDefined();
  });

  describe('create', () => {
    it('should create a cart sucessfully', async () => {
      const createCartControllerDto: CreateCartControllerDto = {
        itens: [
          {
            product: {
              id: randomUUID(),
            },
            quantity: 1,
          },
        ],
      };

      const requestMock = {} as any;

      const newCartId = randomUUID();

      jest.spyOn(cartService, 'create').mockResolvedValueOnce(newCartId);

      const result = await cartController.create(
        requestMock,
        createCartControllerDto,
      );

      expect(result).toStrictEqual({ id: newCartId });
      expect(cartService.create).toHaveBeenCalledTimes(1);
      expect(cartService.create).toHaveBeenCalledWith(createCartControllerDto);
    });

    it('should create a cart with user if a user is finded', async () => {
      const createCartControllerDto: CreateCartControllerDto = {
        itens: [
          {
            product: {
              id: randomUUID(),
            },
            quantity: 1,
          },
        ],
      };

      const requestMock = {
        user: {
          id: randomUUID(),
        },
      } as any;

      const newCartId = randomUUID();

      jest.spyOn(cartService, 'create').mockResolvedValueOnce(newCartId);

      const result = await cartController.create(
        requestMock,
        createCartControllerDto,
      );

      expect(result).toStrictEqual({ id: newCartId });
      expect(cartService.create).toHaveBeenCalledTimes(1);
      expect(cartService.create).toHaveBeenCalledWith({
        ...createCartControllerDto,
        customer: {
          id: requestMock.user.id,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should find a cart successfully', async () => {
      const cartMock: CartEntity = {
        id: randomUUID(),
        total: 20,
        status: CartStatus.OPEN,
      } as CartEntity;

      const requestMock = {} as Request;

      jest.spyOn(cartService, 'findOne').mockResolvedValueOnce(cartMock);

      const result = await cartController.findOne(requestMock, cartMock.id);
      expect(result).toStrictEqual(cartMock);
      expect(cartService.findAnyOpenForCustomer).not.toHaveBeenCalled();
      expect(cartService.findOne).toHaveBeenCalledTimes(1);
      expect(cartService.findOne).toHaveBeenCalledWith(cartMock.id, true);
    });

    it('should find a cart successfully by signed customer', async () => {
      const cartMock: CartEntity = {
        id: randomUUID(),
        customer: {
          id: randomUUID(),
        },
        total: 20,
        status: CartStatus.OPEN,
      } as CartEntity;

      const requestMock = {
        user: {
          id: cartMock.customer.id,
        },
      } as any;

      jest
        .spyOn(cartService, 'findAnyOpenForCustomer')
        .mockResolvedValueOnce(cartMock);

      const result = await cartController.findOne(requestMock);
      expect(result).toStrictEqual(cartMock);
      expect(cartService.findAnyOpenForCustomer).toHaveBeenCalledTimes(1);
      expect(cartService.findAnyOpenForCustomer).toHaveBeenCalledWith(
        requestMock.user.id,
        true,
      );
      expect(cartService.findOne).not.toHaveBeenCalled();
    });
  });
});
