import { Test, TestingModule } from '@nestjs/testing';
import { CustomerAddressController } from './customer-address.controller';
import { CustomerAddressService } from './customer-address.service';
import { randomUUID } from 'crypto';
import { CreateCustomerAddressDto } from './dtos/create-customer-address.dto';
import { CreateCustomerAddressControllerDto } from './dtos/create-customer-address-controller.dto';
import { HttpStatus } from '@nestjs/common';
import { CustomerAddressEntity } from './entities/customer-address.entity';
import { UpdateCustomerAddressDto } from './dtos/update-customer-address.dto';

describe('CustomerAddressController', () => {
  let customerAddressController: CustomerAddressController;
  let customerAddressService: CustomerAddressService;

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
      controllers: [CustomerAddressController],
      providers: [
        {
          provide: CustomerAddressService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
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

  describe('create', () => {
    it('should create a customer address for informed customer', async () => {
      const customerMockId = randomUUID();

      const userMock = {
        id: customerMockId,
      };
      const requestMock = {
        user: userMock,
      } as any;

      const sendMock = jest.fn().mockReturnValue(undefined);
      const statusMock = jest.fn().mockImplementation((_status: number) => {
        return {
          send: sendMock,
        };
      });
      const headerMock = jest.fn().mockReturnValue({ status: statusMock });

      const responseMock = {
        header: headerMock,
      } as any;

      const createCustomerAddressDto: CreateCustomerAddressControllerDto = {
        zipCode: '60347120',
        addressLine1: 'Vila Geovani',
        addressLine2: 'Vila Velha',
        city: 'Fortaleza',
        state: 'CE',
        country: 'Brasil',
      };

      const customerAddresMockId = randomUUID();

      jest
        .spyOn(customerAddressService, 'create')
        .mockResolvedValueOnce(customerAddresMockId);

      const result = await customerAddressController.create(
        createCustomerAddressDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeUndefined();
      expect(customerAddressService.create).toHaveBeenCalledTimes(1);
      expect(headerMock).toHaveBeenCalledTimes(1);
      expect(headerMock).toHaveBeenCalledWith(
        'location',
        `customer-address/${customerAddresMockId}`,
      );
      expect(statusMock).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(sendMock).toHaveBeenCalledWith();
    });
  });

  describe('findAll', () => {
    it('should find all customer addresses for logged user', async () => {
      const customerId = randomUUID();

      const requestMock = {
        user: {
          id: customerId,
        },
      } as any;

      jest
        .spyOn(customerAddressService, 'findAll')
        .mockResolvedValueOnce([customerAddressEntityMock]);

      const result = await customerAddressController.findAll(requestMock);

      expect(result).toStrictEqual([customerAddressEntityMock]);
      expect(customerAddressService.findAll).toHaveBeenCalledTimes(1);
      expect(customerAddressService.findAll).toHaveBeenCalledWith(customerId);
    });
  });

  describe('findOne', () => {
    it('should find a customer address', async () => {
      const customerId = randomUUID();
      const customerAddresId = randomUUID();

      const requestMock = {
        user: {
          id: customerId,
        },
      } as any;

      jest
        .spyOn(customerAddressService, 'findOne')
        .mockResolvedValueOnce(customerAddressEntityMock);

      const request = await customerAddressController.findOne(
        requestMock,
        customerAddresId,
      );

      expect(request).toStrictEqual(customerAddressEntityMock);
      expect(customerAddressService.findOne).toHaveBeenCalledTimes(1);
      expect(customerAddressService.findOne).toHaveBeenCalledWith(
        customerId,
        customerAddresId,
      );
    });
  });

  describe('update', () => {
    it('should update a customer address', async () => {
      const customerMockId = randomUUID();

      const userMock = {
        id: customerMockId,
      };
      const requestMock = {
        user: userMock,
      } as any;

      const sendMock = jest.fn().mockReturnValue(undefined);
      const statusMock = jest.fn().mockImplementation((_status: number) => {
        return {
          send: sendMock,
        };
      });
      const headerMock = jest.fn().mockReturnValue({ status: statusMock });

      const responseMock = {
        header: headerMock,
      } as any;

      const updateCustomerAddressDto: UpdateCustomerAddressDto = {
        zipCode: '45347120',
      };

      const customerAddresMockId = randomUUID();

      jest
        .spyOn(customerAddressService, 'update')
        .mockResolvedValueOnce(customerAddresMockId);

      const result = await customerAddressController.update(
        requestMock,
        customerAddresMockId,
        updateCustomerAddressDto,
        responseMock,
      );

      expect(result).toBeUndefined();
      expect(customerAddressService.update).toHaveBeenCalledTimes(1);
      expect(headerMock).toHaveBeenCalledTimes(1);
      expect(headerMock).toHaveBeenCalledWith(
        'location',
        `customer-address/${customerAddresMockId}`,
      );
      expect(statusMock).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(sendMock).toHaveBeenCalledWith();
    });
  });

  describe('delete', () => {
    it('should delete a customer successfully', async () => {
      const customerMockId = randomUUID();

      const userMock = {
        id: customerMockId,
      };
      const requestMock = {
        user: userMock,
      } as any;

      const sendMock = jest.fn().mockReturnValue(undefined);
      const statusMock = jest.fn().mockImplementation((_status: number) => {
        return {
          send: sendMock,
        };
      });

      const responseMock = {
        status: statusMock,
      } as any;

      const customerAddresMockId = randomUUID();

      jest
        .spyOn(customerAddressService, 'delete')
        .mockResolvedValueOnce(customerAddresMockId);

      const result = await customerAddressController.delete(
        requestMock,
        customerAddresMockId,
        responseMock,
      );

      expect(result).toBeUndefined();
      expect(customerAddressService.delete).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(sendMock).toHaveBeenCalledWith();
    });
  });
});
