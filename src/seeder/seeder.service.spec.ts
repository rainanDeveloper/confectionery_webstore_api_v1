import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { UserService } from '../user/user.service';
import { SeederService } from './seeder.service';
import { PaymentMethodService } from 'src/payment-method/payment-method.service';
import { createPaymentMethodDtos } from './constants/payment-methods.constant';

describe('SeederService', () => {
  let seederService: SeederService;
  let userService: UserService;
  let paymentMethodService: PaymentMethodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeederService,
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
        {
          provide: PaymentMethodService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    seederService = module.get<SeederService>(SeederService);
    userService = module.get<UserService>(UserService);
    paymentMethodService =
      module.get<PaymentMethodService>(PaymentMethodService);
  });

  it('should be defined', () => {
    expect(seederService).toBeDefined();
    expect(userService).toBeDefined();
    expect(paymentMethodService).toBeDefined();
  });

  describe('onApplicationBootstrap', () => {
    it('should seed the database', async () => {
      jest.spyOn(userService, 'findAll').mockResolvedValueOnce([]);
      jest.spyOn(paymentMethodService, 'findAll').mockResolvedValueOnce([]);
      await seederService.onApplicationBootstrap();

      expect(userService.findAll).toHaveBeenCalledTimes(1);
      expect(userService.create).toHaveBeenCalledTimes(1);
      expect(paymentMethodService.findAll).toHaveBeenCalledTimes(1);
      expect(paymentMethodService.create).toHaveBeenCalledTimes(
        createPaymentMethodDtos.length,
      );
    });

    it('should not seed the user table because has a user', async () => {
      const userMock = {
        id: randomUUID(),
        login: 'SomeTestLogin',
        email: 'some.test@email.example',
        password: 'S0m3T3stP4ssw0rd',
        isActive: true,
        firstAccess: true,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
      } as any;

      jest.spyOn(userService, 'findAll').mockResolvedValueOnce([userMock]);
      jest.spyOn(paymentMethodService, 'findAll').mockResolvedValueOnce([]);
      await seederService.onApplicationBootstrap();

      expect(userService.findAll).toHaveBeenCalledTimes(1);
      expect(userService.create).not.toHaveBeenCalled();
      expect(paymentMethodService.findAll).toHaveBeenCalledTimes(1);
      expect(paymentMethodService.create).toHaveBeenCalledTimes(
        createPaymentMethodDtos.length,
      );
    });
  });
});
