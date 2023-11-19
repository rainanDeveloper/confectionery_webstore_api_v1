import { Test, TestingModule } from '@nestjs/testing';
import { CustomerAuthController } from './customer-auth.controller';
import { CustomerAuthService } from './customer-auth.service';

describe('CustomerAuthController', () => {
  let customerAuthController: CustomerAuthController;
  let customerAuthService: CustomerAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerAuthController],
      providers: [
        {
          provide: CustomerAuthService,
          useValue: {},
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
      //Arrange
      //Assert
      //Act
    });
  });
});
