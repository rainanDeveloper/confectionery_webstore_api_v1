import { Test, TestingModule } from '@nestjs/testing';
import { PaymentMethodService } from './payment-method.service';
import { Repository } from 'typeorm';
import { PaymentMethodEntity } from './entities/payment-method.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePaymentMethodDto } from './dtos/create-payment-method.dto';
import { randomUUID } from 'crypto';

describe('PaymentMethodService', () => {
  let paymentMethodService: PaymentMethodService;
  let paymentMethodRepository: Repository<PaymentMethodEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentMethodService,
        {
          provide: getRepositoryToken(PaymentMethodEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    paymentMethodService =
      module.get<PaymentMethodService>(PaymentMethodService);
    paymentMethodRepository = module.get<Repository<PaymentMethodEntity>>(
      getRepositoryToken(PaymentMethodEntity),
    );
  });

  it('should be defined', () => {
    expect(paymentMethodService).toBeDefined();
    expect(paymentMethodRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a payment method successfully', async () => {
      // Arrange
      const createPaymentMethodDto: CreatePaymentMethodDto = {
        reference: 'BTC',
        name: 'BITCOIN',
        status: true,
      };
      const paymentMethodMock = {
        id: randomUUID(),
        ...createPaymentMethodDto,
      } as PaymentMethodEntity;
      jest
        .spyOn(paymentMethodRepository, 'create')
        .mockReturnValueOnce(paymentMethodMock);
      // Act
      const paymentId = await paymentMethodService.create(
        createPaymentMethodDto,
      );
      // Assert
      expect(paymentId).toStrictEqual(paymentMethodMock.id);
      expect(paymentMethodRepository.create).toHaveBeenCalledTimes(1);
      expect(paymentMethodRepository.create).toHaveBeenCalledWith(
        createPaymentMethodDto,
      );
      expect(paymentMethodRepository.save).toHaveBeenCalledTimes(1);
      expect(paymentMethodRepository.save).toHaveBeenCalledWith(
        paymentMethodMock,
      );
    });
  });

  describe('findAll', () => {
    it('should find all payment methods', async () => {
      // Arrange
      const paymentMethodsMock: PaymentMethodEntity[] = [
        {
          id: randomUUID(),
          reference: 'BTC',
          name: 'BITCOIN',
          status: true,
        },
        {
          id: randomUUID(),
          reference: 'PAYPAL',
          name: 'PAYPAL',
          status: false,
        },
      ];
      jest
        .spyOn(paymentMethodRepository, 'find')
        .mockResolvedValueOnce(paymentMethodsMock);
      // Act
      const result = await paymentMethodService.findAll();
      // Assert
      expect(result).toStrictEqual(paymentMethodsMock);
      expect(paymentMethodRepository.find).toHaveBeenCalledTimes(1);
      expect(paymentMethodRepository.find).toHaveBeenCalledWith();
    });
  });
});
