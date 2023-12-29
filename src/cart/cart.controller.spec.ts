import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CreateCartControllerDto } from './dtos/create-cart-controller.dto';
import { randomUUID } from 'crypto';
import { CartEntity } from './entities/cart.entity';
import { CartStatus } from './enums/cart-status.enum';
import { Request } from 'express';
import { CustomerEntity } from 'src/customer/entities/customer.entity';
import { CartItemLinksDto } from './dtos/create-cart-service.dto';
import { CartItemService } from 'src/cart-item/cart-item.service';
import { CartItemEntity } from 'src/cart-item/entities/cart-item.entity';

describe('CartController', () => {
  let cartController: CartController;
  let cartService: CartService;
  let cartItemService: CartItemService;

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
            updateTotal: jest.fn(),
          },
        },
        {
          provide: CartItemService,
          useValue: {
            create: jest.fn(),
            findOneByIdAndCart: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    cartController = module.get<CartController>(CartController);
    cartService = module.get<CartService>(CartService);
    cartItemService = module.get<CartItemService>(CartItemService);
  });

  it('should be defined', () => {
    expect(cartController).toBeDefined();
    expect(cartService).toBeDefined();
    expect(cartItemService).toBeDefined();
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

  describe('addItem', () => {
    it('should add a new item to a cart', async () => {
      const cartMock: CartEntity = {
        id: randomUUID(),
        total: 20,
        status: CartStatus.OPEN,
      } as CartEntity;

      const cartItemDto: CartItemLinksDto = {
        product: {
          id: randomUUID(),
        },
        quantity: 1,
      };

      const mockUnitValue = (Math.random() * 100 * 1000) / 1000;

      const cartItemMock: CartItemEntity = {
        product: cartItemDto.product,
        cart: cartMock,
        unitValue: mockUnitValue,
        quantity: cartItemDto.quantity,
        total: cartItemDto.quantity * mockUnitValue,
      } as CartItemEntity;

      const requestMock = {} as Request;

      jest.spyOn(cartService, 'findOne').mockResolvedValueOnce(cartMock);
      jest.spyOn(cartItemService, 'create').mockResolvedValueOnce(cartItemMock);

      const result = await cartController.addItem(
        requestMock,
        cartItemDto,
        cartMock.id,
      );
      expect(result).toStrictEqual(cartItemMock);
      expect(cartService.findAnyOpenForCustomer).not.toHaveBeenCalled();
      expect(cartService.findOne).toHaveBeenCalledTimes(1);
      expect(cartService.findOne).toHaveBeenCalledWith(cartMock.id, true);
      expect(cartService.findAnyOpenForCustomer).not.toHaveBeenCalled();
      expect(cartService.updateTotal).toHaveBeenCalledTimes(1);
      expect(cartService.updateTotal).toHaveBeenCalledWith(cartMock.id);
      expect(cartItemService.create).toHaveBeenCalledTimes(1);
      expect(cartItemService.create).toHaveBeenCalledWith({
        ...cartItemDto,
        cart: {
          id: cartMock.id,
        },
      });
    });

    it('should add a new item to the cart from the signed customer', async () => {
      const cartMock: CartEntity = {
        id: randomUUID(),
        customer: {
          id: randomUUID(),
        },
        total: 20,
        status: CartStatus.OPEN,
      } as CartEntity;

      const cartItemDto: CartItemLinksDto = {
        product: {
          id: randomUUID(),
        },
        quantity: 1,
      };

      const mockUnitValue = (Math.random() * 100 * 1000) / 1000;

      const cartItemMock: CartItemEntity = {
        product: cartItemDto.product,
        cart: cartMock,
        unitValue: mockUnitValue,
        quantity: cartItemDto.quantity,
        total: cartItemDto.quantity * mockUnitValue,
      } as CartItemEntity;

      const requestMock = {
        user: {
          id: cartMock.customer.id,
        },
      } as any;

      jest
        .spyOn(cartService, 'findAnyOpenForCustomer')
        .mockResolvedValueOnce(cartMock);
      jest.spyOn(cartItemService, 'create').mockResolvedValueOnce(cartItemMock);

      const result = await cartController.addItem(requestMock, cartItemDto);
      expect(result).toStrictEqual(cartItemMock);
      expect(cartService.findAnyOpenForCustomer).toHaveBeenCalledTimes(1);
      expect(cartService.findAnyOpenForCustomer).toHaveBeenCalledWith(
        requestMock.user.id,
        true,
      );
      expect(cartService.findOne).not.toHaveBeenCalled();
      expect(cartService.updateTotal).toHaveBeenCalledTimes(1);
      expect(cartService.updateTotal).toHaveBeenCalledWith(cartMock.id);
      expect(cartItemService.create).toHaveBeenCalledTimes(1);
      expect(cartItemService.create).toHaveBeenCalledWith({
        ...cartItemDto,
        cart: {
          id: cartMock.id,
        },
      });
    });
  });

  describe('removeItem', () => {
    it('should delete a cart item successfully using logged user to find a cart', async () => {
      const itemId = randomUUID();
      const cartMock: CartEntity = {
        id: randomUUID(),
        customer: {
          id: randomUUID(),
        },
        total: 20,
        status: CartStatus.OPEN,
      } as CartEntity;
      const cartItemMock: CartItemEntity = {
        id: itemId,
      } as CartItemEntity;

      const requestMock = {
        user: {
          id: cartMock.customer.id,
        },
      } as any;

      jest
        .spyOn(cartService, 'findAnyOpenForCustomer')
        .mockResolvedValueOnce(cartMock);
      jest
        .spyOn(cartItemService, 'findOneByIdAndCart')
        .mockResolvedValueOnce(cartItemMock);

      const result = await cartController.removeItem(requestMock, itemId);

      expect(result).toBeUndefined();
      expect(cartService.findAnyOpenForCustomer).toHaveBeenCalledTimes(1);
      expect(cartService.findAnyOpenForCustomer).toHaveBeenCalledWith(
        cartMock.customer.id,
        false,
      );
      expect(cartService.findOne).not.toHaveBeenCalled();
      expect(cartItemService.findOneByIdAndCart).toHaveBeenCalledTimes(1);
      expect(cartItemService.findOneByIdAndCart).toHaveBeenCalledWith(
        itemId,
        cartMock.id,
      );
      expect(cartItemService.delete).toHaveBeenCalledTimes(1);
      expect(cartItemService.delete).toHaveBeenCalledWith(itemId);
    });
  });

  it('should delete a cart item successfully using cart id', async () => {
    const requestMock = {} as Request;
    const itemId = randomUUID();
    const id = randomUUID();
    const cartMock: CartEntity = {
      id,
      total: 20,
      status: CartStatus.OPEN,
    } as CartEntity;
    const cartItemMock: CartItemEntity = {
      id: itemId,
    } as CartItemEntity;

    jest.spyOn(cartService, 'findOne').mockResolvedValueOnce(cartMock);
    jest
      .spyOn(cartItemService, 'findOneByIdAndCart')
      .mockResolvedValueOnce(cartItemMock);

    const result = await cartController.removeItem(requestMock, itemId, id);

    expect(result).toBeUndefined();
    expect(cartService.findAnyOpenForCustomer).not.toHaveBeenCalled();
    expect(cartService.findOne).toHaveBeenCalledTimes(1);
    expect(cartService.findOne).toHaveBeenCalledWith(id, false);
    expect(cartItemService.findOneByIdAndCart).toHaveBeenCalledTimes(1);
    expect(cartItemService.findOneByIdAndCart).toHaveBeenCalledWith(itemId, id);
    expect(cartItemService.delete).toHaveBeenCalledTimes(1);
    expect(cartItemService.delete).toHaveBeenCalledWith(itemId);
  });
});
