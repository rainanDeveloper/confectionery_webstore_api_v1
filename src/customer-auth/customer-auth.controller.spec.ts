import { Test, TestingModule } from '@nestjs/testing';
import { CustomerAuthController } from './customer-auth.controller';
import { CustomerAuthService } from './customer-auth.service';
import { CustomerEntity } from 'src/customer/entities/customer.entity';
import { Request } from 'express';
import { randomBytes } from 'crypto';

describe('CustomerAuthController', () => {
  let customerAuthController: CustomerAuthController;
  let customerAuthService: CustomerAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerAuthController],
      providers: [
        {
          provide: CustomerAuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    customerAuthController = module.get<CustomerAuthController>(
      CustomerAuthController,
    );
    customerAuthService = module.get<CustomerAuthService>(CustomerAuthService);
  });

  it('should be defined', () => {
    expect(customerAuthController).toBeDefined();
    expect(customerAuthService).toBeDefined();
  });

  describe('login', () => {
    it('should log in a customer successfully', async () => {
      const customerMock: CustomerEntity = {
        login: 'RonSwanson',
        password: '6ulYi97qf2RkwoBk',
        email: 'ronswanson@fuckthestate.com',
        name: 'Ron Swanson',
      } as CustomerEntity;

      const requestMock: Request = {
        user: customerMock,
      } as any;

      const tokenMock = randomBytes(36).toString('base64');

      jest.spyOn(customerAuthService, 'login').mockReturnValueOnce({
        token: tokenMock,
      });

      const result = customerAuthController.login(requestMock);

      expect(result).toStrictEqual({
        token: tokenMock,
      });
      expect(customerAuthService.login).toHaveBeenCalledTimes(1);
      expect(customerAuthService.login).toHaveBeenCalledWith(
        requestMock.user as CustomerEntity,
      );
    });
  });
});
