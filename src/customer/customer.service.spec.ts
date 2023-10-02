import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
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
});
