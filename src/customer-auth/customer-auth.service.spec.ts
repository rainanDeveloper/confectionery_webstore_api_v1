import { Test, TestingModule } from '@nestjs/testing';
import { CustomerAuthService } from './customer-auth.service';
import { CustomerService } from 'src/customer/customer.service';
import { JwtService } from '@nestjs/jwt';

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
            findOneByEmailOrLogin: jest.fn(),
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
});
