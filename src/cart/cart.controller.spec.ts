import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CreateCartControllerDto } from './dtos/create-cart-controller.dto';
import { randomUUID } from 'crypto';

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

      expect(result).toStrictEqual(newCartId);
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

      expect(result).toStrictEqual(newCartId);
      expect(cartService.create).toHaveBeenCalledTimes(1);
      expect(cartService.create).toHaveBeenCalledWith({
        ...createCartControllerDto,
        customer: {
          id: requestMock.user.id,
        },
      });
    });
  });
});
