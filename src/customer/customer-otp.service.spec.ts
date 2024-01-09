import { Test, TestingModule } from '@nestjs/testing';
import { CustomerOtpService } from './customer-otp.service';
import { Repository } from 'typeorm';
import { CustomerOtpEntity } from './entities/customer-otp.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CustomerOtpService', () => {
  let customerOtpService: CustomerOtpService;
  let customerOtpRepository: Repository<CustomerOtpEntity>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerOtpService,
        {
          provide: getRepositoryToken(CustomerOtpEntity),
          useValue: {},
        },
      ],
    }).compile();

    customerOtpService = module.get<CustomerOtpService>(CustomerOtpService);
    customerOtpRepository = module.get<Repository<CustomerOtpEntity>>(
      getRepositoryToken(CustomerOtpEntity),
    );
  });

  it('Should be defined', () => {
    expect(customerOtpService).toBeDefined();
    expect(customerOtpRepository).toBeDefined();
  });
});
