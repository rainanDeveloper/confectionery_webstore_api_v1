import { Test, TestingModule } from '@nestjs/testing';
import { CustomerAddressService } from './customer-address.service';
import { Repository } from 'typeorm';
import { CustomerAddressEntity } from './entities/customer-address.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateCustomerAddressDto } from './dtos/create-customer-address.dto';
import { randomUUID } from 'crypto';
import { UpdateCustomerAddressDto } from './dtos/update-customer-address.dto';
import { NotFoundException } from '@nestjs/common';

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
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
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

  describe('findAll', () => {
    it('should find all addresses for a specific customer', async () => {
      const customerId = customerAddressEntityMock.id;

      jest
        .spyOn(customerAddressRepository, 'find')
        .mockResolvedValueOnce([customerAddressEntityMock]);

      const result = await customerAddressService.findAll(customerId);

      expect(result).toStrictEqual([customerAddressEntityMock]);
      expect(customerAddressRepository.find).toHaveBeenCalledTimes(1);
      expect(customerAddressRepository.find).toHaveBeenCalledWith({
        where: {
          customer: {
            id: customerId,
          },
        },
      });
    });
  });

  describe('findOne', () => {
    it('should find a customer address sucessfully ', async () => {
      const customerId = randomUUID();
      jest
        .spyOn(customerAddressRepository, 'findOne')
        .mockResolvedValueOnce(customerAddressEntityMock);

      const result = await customerAddressService.findOne(
        customerId,
        customerAddressIdMock,
      );

      expect(result).toStrictEqual(customerAddressEntityMock);
      expect(customerAddressRepository.findOne).toHaveBeenCalledTimes(1);
      expect(customerAddressRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: customerAddressIdMock,
          customer: {
            id: customerId,
          },
        },
      });
    });
  });

  describe('update', () => {
    it('should update a customer address successfully', async () => {
      const customerId = randomUUID();
      jest
        .spyOn(customerAddressService, 'findOne')
        .mockResolvedValueOnce(customerAddressEntityMock);
      const updateCustomerAddressDto: UpdateCustomerAddressDto = {
        city: 'BA',
      };

      const result = await customerAddressService.update(
        customerId,
        customerAddressIdMock,
        updateCustomerAddressDto,
      );

      expect(result).toStrictEqual(customerAddressIdMock);
      expect(customerAddressService.findOne).toHaveBeenCalledTimes(1);
      expect(customerAddressService.findOne).toHaveBeenCalledWith(
        customerId,
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

    it('should return a not found error', async () => {
      const customerId = randomUUID();
      jest.spyOn(customerAddressService, 'findOne').mockResolvedValueOnce(null);
      const updateCustomerAddressDto: UpdateCustomerAddressDto = {
        city: 'BA',
      };

      const resultPromise = customerAddressService.update(
        customerId,
        customerAddressIdMock,
        updateCustomerAddressDto,
      );

      expect(resultPromise).rejects.toThrow(NotFoundException);
      expect(customerAddressService.findOne).toHaveBeenCalledTimes(1);
      expect(customerAddressService.findOne).toHaveBeenCalledWith(
        customerId,
        customerAddressIdMock,
      );
      expect(customerAddressRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a customer address successfully', async () => {
      const customerId = randomUUID();
      jest
        .spyOn(customerAddressService, 'findOne')
        .mockResolvedValueOnce(customerAddressEntityMock);

      const result = await customerAddressService.delete(
        customerId,
        customerAddressIdMock,
      );

      expect(result).toStrictEqual(customerAddressIdMock);
      expect(customerAddressService.findOne).toHaveBeenCalledTimes(1);
      expect(customerAddressService.findOne).toHaveBeenCalledWith(
        customerId,
        customerAddressIdMock,
      );
      expect(customerAddressRepository.delete).toHaveBeenCalledTimes(1);
      expect(customerAddressRepository.delete).toHaveBeenCalledWith({
        id: customerAddressIdMock,
      });
    });

    it('should return a not found error', async () => {
      const customerId = randomUUID();
      jest.spyOn(customerAddressService, 'findOne').mockResolvedValueOnce(null);

      const resultPromise = customerAddressService.delete(
        customerId,
        customerAddressIdMock,
      );

      expect(resultPromise).rejects.toThrow(NotFoundException);
      expect(customerAddressService.findOne).toHaveBeenCalledTimes(1);
      expect(customerAddressService.findOne).toHaveBeenCalledWith(
        customerId,
        customerAddressIdMock,
      );
      expect(customerAddressRepository.delete).not.toHaveBeenCalled();
    });
  });
});
