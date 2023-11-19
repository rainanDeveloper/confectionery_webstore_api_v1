import { Test, TestingModule } from '@nestjs/testing';
import { CustomerAuthService } from './customer-auth.service';
import { CustomerService } from 'src/customer/customer.service';
import { JwtService } from '@nestjs/jwt';
import { CustomerEntity } from 'src/customer/entities/customer.entity';
import { hashSync } from 'bcrypt';

describe('CustomerAuthService', () => {
  let customerAuthService: CustomerAuthService;
  let customerService: CustomerService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerAuthService,
        {
          provide: CustomerService,
          useValue: {
            findOneByLoginOrEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    customerAuthService = module.get<CustomerAuthService>(CustomerAuthService);
    customerService = module.get<CustomerService>(CustomerService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(customerAuthService).toBeDefined();
    expect(customerService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('validateCustomer', () => {
    it('should validate a customer successfully', async () => {
      const login = 'some_login';
      const password = 'cbvaY2CEmXaqQpin';

      const customerMock: CustomerEntity = new CustomerEntity();

      customerMock.login = login;
      customerMock.password = hashSync(password, 8);

      jest
        .spyOn(customerService, 'findOneByLoginOrEmail')
        .mockResolvedValueOnce(customerMock);

      const result = await customerAuthService.validateCustomer(
        login,
        password,
      );

      expect(result).toStrictEqual(customerMock);
      expect(customerService.findOneByLoginOrEmail).toHaveBeenCalledTimes(1);
      expect(customerService.findOneByLoginOrEmail).toHaveBeenCalledWith(login);
    });

    it('should return null if a customer is not found', async () => {
      const login = 'some_login';
      const password = 'cbvaY2CEmXaqQpin';

      jest
        .spyOn(customerService, 'findOneByLoginOrEmail')
        .mockResolvedValueOnce(undefined);

      const result = await customerAuthService.validateCustomer(
        login,
        password,
      );

      expect(result).toStrictEqual(null);
      expect(customerService.findOneByLoginOrEmail).toHaveBeenCalledTimes(1);
      expect(customerService.findOneByLoginOrEmail).toHaveBeenCalledWith(login);
    });

    it('should return null if method to return customer fails', async () => {
      const login = 'some_login';
      const password = 'cbvaY2CEmXaqQpin';

      jest
        .spyOn(customerService, 'findOneByLoginOrEmail')
        .mockRejectedValueOnce(new Error());

      const result = await customerAuthService.validateCustomer(
        login,
        password,
      );

      expect(result).toStrictEqual(null);
      expect(customerService.findOneByLoginOrEmail).toHaveBeenCalledTimes(1);
      expect(customerService.findOneByLoginOrEmail).toHaveBeenCalledWith(login);
    });

    it('should return null if method to return customer fails', async () => {
      const login = 'some_login';
      const password = 'cbvaY2CEmXaqQpin';

      const customerMock: CustomerEntity = new CustomerEntity();

      customerMock.login = login;
      customerMock.password = hashSync('anotherPass', 8);

      jest
        .spyOn(customerService, 'findOneByLoginOrEmail')
        .mockResolvedValueOnce(customerMock);

      const result = await customerAuthService.validateCustomer(
        login,
        password,
      );

      expect(result).toStrictEqual(null);
      expect(customerService.findOneByLoginOrEmail).toHaveBeenCalledTimes(1);
      expect(customerService.findOneByLoginOrEmail).toHaveBeenCalledWith(login);
    });
  });
});
