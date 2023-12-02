import { Test, TestingModule } from '@nestjs/testing';
import { CartItemService } from './cart-item.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartItemEntity } from './entities/cart-item.entity';
import { Repository } from 'typeorm';
import { CreateCartItemDto } from './dtos/create-cart-item.dto';
import { randomUUID } from 'crypto';
import { ProductService } from 'src/product/product.service';
import { ProductEntity } from 'src/product/entities/product.entity';

describe('CartItemService', () => {
  let cartItemService: CartItemService;
  let cartItemRepository: Repository<CartItemEntity>;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartItemService,
        {
          provide: getRepositoryToken(CartItemEntity),
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: ProductService,
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
  });

  it('should be defined', () => {
    expect(cartItemService).toBeDefined();
    expect(cartItemRepository).toBeDefined();
    expect(productService).toBeDefined();
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

      const productMock = new ProductEntity();

      productMock.id = cartItemMock.product.id;
      productMock.stockAmount = 10;

      cartItemMock.product = {} as any;
      cartItemMock.cart = {} as any;

      cartItemMock.product.id = createCartItemDto.product.id;
      cartItemMock.cart.id = createCartItemDto.cart.id;

      jest
        .spyOn(cartItemRepository, `create`)
        .mockReturnValueOnce(cartItemMock);

      jest.spyOn(productService, 'findOne').mockResolvedValueOnce(productMock);

      const result = await cartItemService.create(createCartItemDto);

      expect(result).toStrictEqual(cartItemMock);
      expect(cartItemRepository.create).toHaveBeenCalledTimes(1);
      expect(cartItemRepository.create).toHaveBeenCalledWith(createCartItemDto);
      expect(productService.findOne).toHaveBeenCalledTimes(1);
      expect(productService.findOne).toHaveBeenCalledWith(productMock.id);
    });
  });
});
