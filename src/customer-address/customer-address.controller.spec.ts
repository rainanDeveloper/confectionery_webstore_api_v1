import { Test, TestingModule } from '@nestjs/testing';
import { CustomerAddressController } from './customer-address.controller';
import { CustomerAddressService } from './customer-address.service';

describe('CustomerAddressController', () => {
  let customerAddressController: CustomerAddressController;
  let customerAddressService: CustomerAddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerAddressController],
      providers: [
        {
          provide: CustomerAddressService,
          useValue: {},
        },
      ],
    }).compile();

    customerAddressController = module.get<CustomerAddressController>(
      CustomerAddressController,
    );
    customerAddressService = module.get<CustomerAddressService>(
      CustomerAddressService,
    );
  });

  it('should be defined', () => {
    expect(customerAddressController).toBeDefined();
    expect(customerAddressService).toBeDefined();
  });
});
