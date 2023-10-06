import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';

describe('CustomerController', () => {
  let customerController: CustomerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
    }).compile();

    customerController = module.get<CustomerController>(CustomerController);
  });

  it('should be defined', () => {
    expect(customerController).toBeDefined();
  });
});
