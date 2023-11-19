import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { CustomerEntity } from './entities/customer.entity';

describe('CustomerService', () => {
  let customerService: CustomerService;
  let customerRepository: Repository<CustomerEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getRepositoryToken(CustomerEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    customerService = module.get<CustomerService>(CustomerService);
    customerRepository = module.get<Repository<CustomerEntity>>(
      getRepositoryToken(CustomerEntity),
    );
  });

  it('should be defined', () => {
    expect(customerService).toBeDefined();
    expect(customerRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a customer successfully', async () => {
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

      jest
        .spyOn(customerRepository, 'create')
        .mockReturnValueOnce(customerMock);

      const result = await customerService.create(customerDto);

      expect(result).toEqual(customerMock.id);
      expect(customerRepository.create).toHaveBeenCalledWith(customerDto);
      expect(customerRepository.create).toHaveBeenCalledTimes(1);
      expect(customerRepository.save).toHaveBeenCalledWith(customerMock);
      expect(customerRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should find a customer successfully', async () => {
      const customerMock = new CustomerEntity();
      const id = randomUUID();
      customerMock.id = id;

      jest
        .spyOn(customerRepository, 'findOne')
        .mockResolvedValueOnce(customerMock);

      const result = await customerService.findOne(id);

      expect(result).toStrictEqual(customerMock);
      expect(customerRepository.findOne).toHaveBeenCalledTimes(1);
      expect(customerRepository.findOne).toHaveBeenCalledWith({
        select: [
          'id',
          'login',
          'email',
          'name',
          'contactPhone',
          'whatsapp',
          'addresses',
        ],
        where: {
          id,
        },
      });
    });
  });

  describe('findOneByLoginOrEmail', () => {
    it('should find a user by login or email', async () => {
      const loginOrEmail = 'some_login';

      const customerMock: CustomerEntity = new CustomerEntity();

      customerMock.login = loginOrEmail;

      jest
        .spyOn(customerRepository, 'findOne')
        .mockResolvedValueOnce(customerMock);

      const response = await customerService.findOneByLoginOrEmail(
        loginOrEmail,
      );

      expect(response).toStrictEqual(customerMock);
      expect(customerRepository.findOne).toHaveBeenCalledTimes(1);
      expect(customerRepository.findOne).toHaveBeenCalledWith({
        where: [
          {
            email: loginOrEmail,
          },
          {
            login: loginOrEmail,
          },
        ],
      });
    });
  });

  describe('update', () => {
    it('should update the customer successfully', async () => {
      const customerMock = new CustomerEntity();
      const id = randomUUID();
      customerMock.id = id;

      const customerDto: UpdateCustomerDto = {
        login: 'SomeNewLogin',
      };

      jest
        .spyOn(customerService, 'findOne')
        .mockResolvedValueOnce(customerMock);

      const result = await customerService.update(id, customerDto);

      expect(result).toStrictEqual(id);
      expect(customerService.findOne).toHaveBeenCalledTimes(1);
      expect(customerService.findOne).toHaveBeenCalledWith(id);
      expect(customerRepository.update).toHaveBeenCalledTimes(1);
      expect(customerRepository.update).toHaveBeenCalledWith(
        { id },
        customerDto,
      );
    });
  });

  describe('delete', () => {
    it('should delete a customer sucessfully', async () => {
      const customerMock = new CustomerEntity();
      const id = randomUUID();
      customerMock.id = id;

      jest
        .spyOn(customerService, 'findOne')
        .mockResolvedValueOnce(customerMock);

      const result = await customerService.delete(id);

      expect(result).not.toBeDefined();
      expect(customerRepository.delete).toHaveBeenCalledTimes(1);
      expect(customerRepository.delete).toHaveBeenCalledWith({ id });
    });
  });
});
