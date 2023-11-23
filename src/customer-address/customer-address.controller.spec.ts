import { Test, TestingModule } from '@nestjs/testing';
import { CustomerAddressController } from './customer-address.controller';
import { CustomerAddressService } from './customer-address.service';
import { randomUUID } from 'crypto';
import { CreateCustomerAddressDto } from './dtos/create-customer-address.dto';
import { CreateCustomerAddressControllerDto } from './dtos/create-customer-address-controller.dto';
import { HttpStatus } from '@nestjs/common';
import { CustomerAddressEntity } from './entities/customer-address.entity';

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
        `customer-address/${customerMockId}/${customerAddresMockId}`,
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
        .spyOn(customerAddressController, 'findAll')
        .mockResolvedValueOnce([customerAddressEntityMock]);

      const result = await customerAddressController.findAll(requestMock);

      expect(result).toStrictEqual([customerAddressEntityMock]);
      expect(customerAddressService.findAll).toHaveBeenCalledTimes(1);
      expect(customerAddressService.findAll).toHaveBeenCalledWith(customerId);
    });
  });
});
