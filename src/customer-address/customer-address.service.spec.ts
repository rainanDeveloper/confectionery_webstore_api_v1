import { Test, TestingModule } from '@nestjs/testing';
import { CustomerAddressService } from './customer-address.service';
import { Repository } from 'typeorm';
import { CustomerAddressEntity } from './entities/customer-address.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CustomerAddressService', () => {
  let customerAddressService: CustomerAddressService;
  let customerAddressRepository: Repository<CustomerAddressEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerAddressService,
        {
          provide: getRepositoryToken(CustomerAddressEntity),
          useValue: {},
        },
      ],
    }).compile();

    customerAddressService = module.get<CustomerAddressService>(
      CustomerAddressService,
    );
    customerAddressRepository = module.get<Repository<CustomerAddressEntity>>(
      getRepositoryToken(CustomerAddressEntity),
    );
  });

  it('should be defined', () => {
    expect(customerAddressService).toBeDefined();
    expect(customerAddressRepository).toBeDefined();
  });
});
