import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { UserEntity } from 'src/user/entities/user.entity';
import { AuthCustomerStrategy } from './auth-customer.strategy';
import { CustomerAuthService } from '../customer-auth.service';
import { CustomerEntity } from 'src/customer/entities/customer.entity';

describe('LocalCustomerStrategy', () => {
  let localCustomerStrategy: AuthCustomerStrategy;
  let customerAuthService: CustomerAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthCustomerStrategy,
        {
          provide: CustomerAuthService,
          useValue: {
            validateCustomer: jest.fn(),
          },
        },
      ],
    }).compile();

    localCustomerStrategy =
      module.get<AuthCustomerStrategy>(AuthCustomerStrategy);
    customerAuthService = module.get<CustomerAuthService>(CustomerAuthService);
  });

  it('should be defined', () => {
    expect(localCustomerStrategy).toBeDefined();
    expect(customerAuthService).toBeDefined();
  });

  describe('validate', () => {
    it('should validate a user sucessfully', async () => {
      const mockUser: CustomerEntity = {
        id: randomUUID(),
        login: 'some_login',
        email: 'some@login.mail',
        password: '3mTOOe9p3t',
      } as CustomerEntity;

      jest
        .spyOn(customerAuthService, 'validateCustomer')
        .mockResolvedValueOnce(mockUser);

      const result = await localCustomerStrategy.validate(
        mockUser.login,
        mockUser.password,
      );

      expect(result).toBeDefined();
      expect(result).toEqual(mockUser);
      expect(customerAuthService.validateCustomer).toHaveBeenCalledTimes(1);
      expect(customerAuthService.validateCustomer).toHaveBeenCalledWith(
        mockUser.login,
        mockUser.password,
      );
    });
    it('should throw an UnauthorizedException', () => {
      const mockUser: UserEntity = {
        id: randomUUID(),
        login: 'some_login',
        email: 'some@login.mail',
        password: '3mTOOe9p3t',
      } as UserEntity;

      jest
        .spyOn(customerAuthService, 'validateCustomer')
        .mockResolvedValueOnce(null);

      const resultPromise = localCustomerStrategy.validate(
        mockUser.login,
        mockUser.password,
      );

      expect(resultPromise).rejects.toThrow(UnauthorizedException);
    });
  });
});
