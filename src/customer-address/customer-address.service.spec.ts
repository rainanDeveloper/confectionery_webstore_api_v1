import { Test, TestingModule } from '@nestjs/testing';
import { CustomerAddressService } from './customer-address.service';
import { Repository } from 'typeorm';
import { CustomerAddressEntity } from './entities/customer-address.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateCustomerAddressDto } from './dtos/create-customer-address.dto';
import { randomUUID } from 'crypto';
import { UpdateCustomerAddressDto } from './dtos/update-customer-address.dto';

describe('CustomerAddressService', () => {
  let customerAddressService: CustomerAddressService;
  let customerAddressRepository: Repository<CustomerAddressEntity>;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerAddressService,
        {
          provide: getRepositoryToken(CustomerAddressEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
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
    it('should create a customer address successfully', async () => {
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

  describe('findOne', () => {
    it('should find a customer address sucessfully ', async () => {
      jest
        .spyOn(customerAddressRepository, 'findOne')
        .mockResolvedValueOnce(customerAddressEntityMock);

      const result = await customerAddressService.findOne(
        customerAddressIdMock,
      );

      expect(result).toStrictEqual(customerAddressEntityMock);
      expect(customerAddressRepository.findOne).toHaveBeenCalledTimes(1);
      expect(customerAddressRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: customerAddressIdMock,
        },
      });
    });
  });

  describe('update', () => {
    it('should update a customer address successfully', async () => {
      jest
        .spyOn(customerAddressService, 'findOne')
        .mockResolvedValueOnce(customerAddressEntityMock);
      const updateCustomerAddressDto: UpdateCustomerAddressDto = {
        city: 'BA',
      };

      const result = await customerAddressService.update(
        customerAddressIdMock,
        updateCustomerAddressDto,
      );

      expect(result).toStrictEqual(customerAddressIdMock);
      expect(customerAddressService.findOne).toHaveBeenCalledTimes(1);
      expect(customerAddressService.findOne).toHaveBeenCalledWith(
        customerAddressIdMock,
      );
      expect(customerAddressRepository.update).toHaveBeenCalledTimes(1);
      expect(customerAddressRepository.update).toHaveBeenCalledWith(
        {
          id: customerAddressIdMock,
        },
        updateCustomerAddressDto,
      );
    });
  });

  describe('delete', () => {
    it('', async () => {
      //Arrange
      //Assert
      //Act
    });
  });
});
