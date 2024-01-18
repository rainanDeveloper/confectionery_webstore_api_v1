import { Test, TestingModule } from '@nestjs/testing';
import { CustomerOtpService } from './customer-otp.service';
import { Repository } from 'typeorm';
import { CustomerOtpEntity } from './entities/customer-otp.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateCustomerOtpDto } from './dtos/create-customer-otp.dto';
import { randomUUID } from 'crypto';

describe('CustomerOtpService', () => {
  let customerOtpService: CustomerOtpService;
  let customerOtpRepository: Repository<CustomerOtpEntity>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerOtpService,
        {
          provide: getRepositoryToken(CustomerOtpEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
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

  describe('create', () => {
    it('Should create a new customer opt record', async () => {
      const customerOtpDto: CreateCustomerOtpDto = {
        otp: randomUUID(),
        email: 'some_user@email.example',
      };

      const customerOtpMock: CustomerOtpEntity = {
        ...customerOtpDto,
      } as CustomerOtpEntity;

      jest
        .spyOn(customerOtpRepository, 'create')
        .mockReturnValueOnce(customerOtpMock);

      const result = await customerOtpService.create(customerOtpDto);

      expect(result).toStrictEqual(customerOtpMock);
      expect(customerOtpRepository.create).toHaveBeenCalledTimes(1);
      expect(customerOtpRepository.create).toHaveBeenCalledWith(customerOtpDto);
      expect(customerOtpRepository.save).toHaveBeenCalledTimes(1);
      expect(customerOtpRepository.save).toHaveBeenCalledWith(customerOtpMock);
    });
  });

  describe('findOne', () => {
    it('Should find a customer otp successfully', async () => {
      const otpMock = randomUUID();
      const customerOtpMock: CustomerOtpEntity = {
        otp: otpMock,
        email: 'some@email.example',
      } as CustomerOtpEntity;

      jest
        .spyOn(customerOtpRepository, 'findOne')
        .mockResolvedValueOnce(customerOtpMock);

      const result = await customerOtpService.findOne(otpMock);

      expect(result).toStrictEqual(customerOtpMock);
      expect(customerOtpRepository.findOne).toHaveBeenCalledTimes(1);
      expect(customerOtpRepository.findOne).toHaveBeenCalledWith({
        where: {
          otp: otpMock,
        },
      });
    });
  });

  describe('delete', () => {
    it('Should delete a otp record', async () => {
      const otpMock = randomUUID();
      const result = await customerOtpService.delete(otpMock);

      expect(result).toBeUndefined();
      expect(customerOtpRepository.delete).toHaveBeenCalledTimes(1);
      expect(customerOtpRepository.delete).toHaveBeenCalledWith({
        otp: otpMock,
      });
    });
  });
});
