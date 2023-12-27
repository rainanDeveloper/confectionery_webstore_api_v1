import { Test, TestingModule } from '@nestjs/testing';
import { CartItemService } from './cart-item.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartItemEntity } from './entities/cart-item.entity';
import { Repository } from 'typeorm';
import { CreateCartItemDto } from './dtos/create-cart-item.dto';
import { randomUUID } from 'crypto';
import { ProductService } from 'src/product/product.service';
import { ProductEntity } from 'src/product/entities/product.entity';
import { NewCartItemDto } from './dtos/new-cart-item.dto';
import { CartService } from 'src/cart/cart.service';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CartItemService', () => {
  let cartItemService: CartItemService;
  let cartItemRepository: Repository<CartItemEntity>;
  let productService: ProductService;
  let cartService: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartItemService,
        {
          provide: getRepositoryToken(CartItemEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: ProductService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: CartService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    cartItemService = module.get<CartItemService>(CartItemService);
    cartItemRepository = module.get<Repository<CartItemEntity>>(
      getRepositoryToken(CartItemEntity),
    );
    productService = module.get<ProductService>(ProductService);
    cartService = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(cartItemService).toBeDefined();
    expect(cartItemRepository).toBeDefined();
    expect(productService).toBeDefined();
    expect(cartService).toBeDefined();
  });

  describe('create', () => {
    it('should create a cart item sucessfully', async () => {
      const createCartItemDto: CreateCartItemDto = {
        product: {
          id: randomUUID(),
        },
        cart: {
          id: randomUUID(),
        },
        quantity: 1,
      };

      const cartItemMock = new CartItemEntity();

      cartItemMock.product = {} as any;
      cartItemMock.cart = {} as any;

      cartItemMock.product.id = createCartItemDto.product.id;
      cartItemMock.cart.id = createCartItemDto.cart.id;

      const cartMock = new CartEntity();

      cartMock.id = cartItemMock.cart.id;

      const productMock = new ProductEntity();

      productMock.id = cartItemMock.product.id;
      productMock.stockAmount = 10;
      productMock.stockReservedAmount = 2;
      productMock.unitValue = 20;

      const newCartItemDto: NewCartItemDto = {
        ...createCartItemDto,
        unitValue: productMock.unitValue,
        total: productMock.unitValue * createCartItemDto.quantity,
      };

      jest.spyOn(cartService, 'findOne').mockResolvedValueOnce(cartMock);

      jest.spyOn(productService, 'findOne').mockResolvedValueOnce(productMock);

      jest
        .spyOn(cartItemRepository, `create`)
        .mockReturnValueOnce(cartItemMock);

      const result = await cartItemService.create(createCartItemDto);

      expect(result).toStrictEqual(cartItemMock);
      expect(cartService.findOne).toHaveBeenCalledTimes(1);
      expect(cartService.findOne).toHaveBeenCalledWith(
        createCartItemDto.cart.id,
        false,
      );
      expect(productService.findOne).toHaveBeenCalledTimes(1);
      expect(productService.findOne).toHaveBeenCalledWith(productMock.id);
      expect(cartItemRepository.create).toHaveBeenCalledTimes(1);
      expect(cartItemRepository.create).toHaveBeenCalledWith(newCartItemDto);
    });

    it('should validate the existence of the cart', async () => {
      const createCartItemDto: CreateCartItemDto = {
        product: {
          id: randomUUID(),
        },
        cart: {
          id: randomUUID(),
        },
        quantity: 1,
      };

      jest.spyOn(cartService, 'findOne').mockResolvedValueOnce(undefined);

      const resultPromise = cartItemService.create(createCartItemDto);

      expect(resultPromise)
        .rejects.toThrow(NotFoundException)
        .then(() => {
          expect(cartService.findOne).toHaveBeenCalledTimes(1);
          expect(cartService.findOne).toHaveBeenCalledWith(
            createCartItemDto.cart.id,
            false,
          );
          expect(productService.findOne).not.toHaveBeenCalled();
          expect(cartItemRepository.create).not.toHaveBeenCalled();
        });
    });

    it('should validate the existence of the product', async () => {
      const createCartItemDto: CreateCartItemDto = {
        product: {
          id: randomUUID(),
        },
        cart: {
          id: randomUUID(),
        },
        quantity: 1,
      };

      const cartMock = new CartEntity();

      cartMock.id = createCartItemDto.cart.id;

      jest.spyOn(cartService, 'findOne').mockResolvedValueOnce(cartMock);

      jest.spyOn(productService, 'findOne').mockResolvedValueOnce(undefined);

      const resultPromise = cartItemService.create(createCartItemDto);

      expect(resultPromise)
        .rejects.toThrow(NotFoundException)
        .then(() => {
          expect(cartService.findOne).toHaveBeenCalledTimes(1);
          expect(cartService.findOne).toHaveBeenCalledWith(
            createCartItemDto.cart.id,
            false,
          );
          expect(productService.findOne).toHaveBeenCalledTimes(1);
          expect(productService.findOne).toHaveBeenCalledWith(
            createCartItemDto.product.id,
          );
          expect(cartItemRepository.create).not.toHaveBeenCalled();
        });
    });

    it('should validate the product when the selled amount is higher than the available', async () => {
      const createCartItemDto: CreateCartItemDto = {
        product: {
          id: randomUUID(),
        },
        cart: {
          id: randomUUID(),
        },
        quantity: 1,
      };

      const cartMock = new CartEntity();

      cartMock.id = createCartItemDto.cart.id;

      const productMock = new ProductEntity();

      productMock.id = createCartItemDto.product.id;
      productMock.stockAmount = 10;
      productMock.stockReservedAmount = 10;
      productMock.unitValue = 20;

      jest.spyOn(cartService, 'findOne').mockResolvedValueOnce(cartMock);

      jest.spyOn(productService, 'findOne').mockResolvedValueOnce(productMock);

      const resultPromise = cartItemService.create(createCartItemDto);

      expect(resultPromise)
        .rejects.toThrow(BadRequestException)
        .then(() => {
          expect(cartService.findOne).toHaveBeenCalledTimes(1);
          expect(cartService.findOne).toHaveBeenCalledWith(
            createCartItemDto.cart.id,
            false,
          );
          expect(productService.findOne).toHaveBeenCalledTimes(1);
          expect(productService.findOne).toHaveBeenCalledWith(
            createCartItemDto.product.id,
          );
          expect(cartItemRepository.create).not.toHaveBeenCalled();
        });
    });
  });

  describe('delete', () => {
    it('should delete an item successfully', async () => {
      const idMock = randomUUID();

      const result = await cartItemService.delete(idMock);

      expect(result).toBeUndefined();
      expect(cartItemRepository.delete).toHaveBeenCalledTimes(1);
      expect(cartItemRepository.delete).toHaveBeenCalledWith({
        id: idMock,
      });
    });
  });
});
