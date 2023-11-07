import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

describe('CustomerController', () => {
  let customerController: CustomerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: {},
        },
      ],
    }).compile();

    customerController = module.get<CustomerController>(CustomerController);
  });

  it('should be defined', () => {
    expect(customerController).toBeDefined();
  });
});
