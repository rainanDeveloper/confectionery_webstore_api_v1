import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Response } from 'express';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { randomUUID } from 'crypto';
import { HttpStatus } from '@nestjs/common';
import { CustomerEntity } from './entities/customer.entity';
import { UpdateCustomerDto } from './dtos/update-customer.dto';

describe('CustomerController', () => {
  let customerController: CustomerController;
  let customerService: CustomerService;

  const customerDto: CreateCustomerDto = {
    login: 'UserLogin',
    password: 'UserP4ssw0rd',
    email: 'user@email.com',
    name: 'User Name',
    contactPhone: '99999999',
    whatsapp: '99999999',
  };

  const customerMock = new CustomerEntity();

  customerMock.id = randomUUID();
  customerMock.login = customerDto.login;
  customerMock.password = customerDto.password;
  customerMock.email = customerDto.email;
  customerMock.name = customerDto.name;
  customerMock.contactPhone = customerDto.contactPhone;
  customerMock.whatsapp = customerDto.whatsapp;
  customerMock.hashPassword();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    customerController = module.get<CustomerController>(CustomerController);
    customerService = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(customerController).toBeDefined();
  });

  describe('create', () => {
    it('should create a new customer successfully', async () => {
      const sendMock = jest.fn().mockReturnValue(undefined);
      const statusMock = jest.fn().mockImplementation((_status: number) => {
        return {
          send: sendMock,
        };
      });
      const headerMock = jest.fn().mockReturnValue({ status: statusMock });

      const requestMock = {
        headers: {},
      } as any;

      const responseMock = {
        header: headerMock,
      } as any;

      const customerMockId = randomUUID();

      jest
        .spyOn(customerService, 'create')
        .mockResolvedValueOnce(customerMockId);

      const result = await customerController.create(
        requestMock,
        customerDto,
        responseMock,
      );

      expect(result).toBeUndefined();
      expect(customerService.create).toHaveBeenCalledTimes(1);
      expect(customerService.create).toHaveBeenCalledWith(customerDto);
      expect(headerMock).toHaveBeenCalledTimes(1);
      expect(headerMock).toHaveBeenCalledWith(
        'location',
        `customer/${customerMockId}`,
      );
      expect(statusMock).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(sendMock).toHaveBeenCalledWith();
    });
  });

  describe('findOne', () => {
    it('should find a customer successfully', async () => {
      const customerId = randomUUID();

      const requestMock = {
        user: {
          id: customerId,
        },
      } as any;

      jest
        .spyOn(customerService, 'findOne')
        .mockResolvedValueOnce(customerMock);

      const result = await customerController.findOne(requestMock);

      expect(result).toStrictEqual(customerMock);
      expect(customerService.findOne).toHaveBeenCalledTimes(1);
      expect(customerService.findOne).toHaveBeenCalledWith(customerId);
    });
  });

  describe('update', () => {
    it('should update a customer successfully', async () => {
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

      const customerId = randomUUID();
      const requestMock = {
        user: {
          id: customerId,
        },
      } as any;

      const updateCustomerDto: UpdateCustomerDto = {
        name: 'Some New name',
      };

      const result = await customerController.update(
        requestMock,
        updateCustomerDto,
        responseMock,
      );

      expect(result).toBeUndefined();
      expect(customerService.update).toHaveBeenCalledTimes(1);
      expect(customerService.update).toHaveBeenCalledWith(
        customerId,
        updateCustomerDto,
      );
      expect(headerMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should delete a customer successfully', async () => {
      const customerId = randomUUID();

      const requestMock = {
        user: {
          id: customerId,
        },
      } as any;

      const result = await customerController.delete(requestMock);

      expect(result).toBeUndefined();
      expect(customerService.delete).toHaveBeenCalledTimes(1);
      expect(customerService.delete).toHaveBeenCalledWith(customerId);
    });
  });
});
