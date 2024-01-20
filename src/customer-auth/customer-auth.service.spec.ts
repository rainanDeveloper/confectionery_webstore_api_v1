import { Test, TestingModule } from '@nestjs/testing';
import { CustomerAuthService } from './customer-auth.service';
import { CustomerService } from 'src/customer/customer.service';
import { JwtService } from '@nestjs/jwt';
import { CustomerEntity } from 'src/customer/entities/customer.entity';
import { hashSync } from 'bcrypt';
import { randomBytes } from 'crypto';
import { JwtPayloadDto } from './dtos/jwt-payload.dto';

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

  describe('login', () => {
    it('should log in a user', async () => {
      const customerMock: CustomerEntity = {
        login: 'RonSwanson',
        password: '6ulYi97qf2RkwoBk',
        email: 'ronswanson@fuckthestate.com',
        name: 'Ron Swanson',
        isActive: true,
      } as CustomerEntity;

      const payloadMock: JwtPayloadDto = {
        sub: customerMock.id,
        email: customerMock.email,
        login: customerMock.login,
      };

      const tokenMock = randomBytes(36).toString('base64');

      jest.spyOn(jwtService, 'sign').mockReturnValueOnce(tokenMock);

      const result = customerAuthService.login(customerMock);

      expect(result).toStrictEqual({ token: tokenMock });
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith(payloadMock);
    });
  });

  describe('validateCustomer', () => {
    it('should validate a customer successfully', async () => {
      const login = 'some_login';
      const password = 'cbvaY2CEmXaqQpin';

      const customerMock: CustomerEntity = new CustomerEntity();

      customerMock.login = login;
      customerMock.password = hashSync(password, 8);
      customerMock.isActive = true;

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

    it('should return null if finded customer is not active', async () => {
      const login = 'some_login';
      const password = 'cbvaY2CEmXaqQpin';

      const customerMock: CustomerEntity = new CustomerEntity();

      customerMock.login = login;
      customerMock.password = hashSync('anotherPass', 8);
      customerMock.isActive = false;

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
    it('should return null if password is wrong', async () => {
      const login = 'some_login';
      const password = 'cbvaY2CEmXaqQpin';

      const customerMock: CustomerEntity = new CustomerEntity();

      customerMock.login = login;
      customerMock.password = hashSync('anotherPass', 8);
      customerMock.isActive = true;

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
