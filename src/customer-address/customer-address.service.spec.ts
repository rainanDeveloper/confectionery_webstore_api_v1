import { Test, TestingModule } from '@nestjs/testing';
import { CustomerAddressService } from './customer-address.service';
import { Repository } from 'typeorm';
import { CustomerAddressEntity } from './entities/customer-address.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateCustomerAddressDto } from './dtos/create-customer-address.dto';
import { randomUUID } from 'crypto';

describe('CustomerAddressService', () => {
  let customerAddressService: CustomerAddressService;
  let customerAddressRepository: Repository<CustomerAddressEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerAddressService,
        {
          provide: getRepositoryToken(CustomerAddressEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
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

  describe('create', () => {
    it('should create a customer successfully', async () => {
      const customerAddressIdMock = randomUUID();

      const createCustomerAddressDto: CreateCustomerAddressDto = {
        customer: {
          id: randomUUID(),
        },
        zipCode: '50620210',
        addressLine1: 'Rua Buaitirema',
        addressLine2: 'Torre',
        city: 'Recife',
        state: 'PE',
        country: 'Brasil',
      };
      const nowMock = new Date();

      const customerAddressEntityMock = {
        id: customerAddressIdMock,
        ...createCustomerAddressDto,
        createdAt: nowMock,
        updatedAt: nowMock,
      } as CustomerAddressEntity;

      jest
        .spyOn(customerAddressRepository, 'create')
        .mockReturnValueOnce(customerAddressEntityMock);

      const result = await customerAddressService.create(
        createCustomerAddressDto,
      );

      expect(result).toStrictEqual(customerAddressIdMock);
      expect(customerAddressRepository.create).toHaveBeenCalledTimes(1);
      expect(customerAddressRepository.create).toHaveBeenCalledWith(
        createCustomerAddressDto,
      );
      expect(customerAddressRepository.save).toHaveBeenCalledTimes(1);
      expect(customerAddressRepository.save).toHaveBeenCalledWith(
        customerAddressEntityMock,
      );
    });
  });
});
