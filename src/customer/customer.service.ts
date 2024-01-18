import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { CustomerEntity } from './entities/customer.entity';
import { MailService } from 'src/mail/mail.service';
import { CustomerOtpService } from './customer-otp.service';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
    @Inject(MailService)
    private readonly mailService: MailService,
    @Inject(CustomerOtpService)
    private readonly customerOtpService: CustomerOtpService,
  ) {}

  async create(customerDto: CreateCustomerDto): Promise<string> {
    const newUser = this.customerRepository.create(customerDto);

    await this.customerRepository.save(newUser);

    await this.mailService.sendCustomerConfirmationEmail({
      login: newUser.login,
      email: newUser.email,
    });

    return newUser.id;
  }

  async activateUser(otp: string) {
    const otpRecord = await this.customerOtpService.findOne(otp);

    if (!otpRecord) {
      throw new NotFoundException(`Customer with informed otp not found!`);
    }

    const { email } = otpRecord;

    const customer = await this.findOneByLoginOrEmail(email);

    if (!customer) {
      throw new NotFoundException(`Customer with informed otp not found!`);
    }

    customer.isActive = true;

    await this.customerRepository.save(customer);
  }

  async findOne(id: string): Promise<CustomerEntity> {
    const finded = await this.customerRepository.findOne({
      where: {
        id,
      },
      select: [
        'id',
        'login',
        'email',
        'name',
        'contactPhone',
        'whatsapp',
        'addresses',
      ],
    });

    if (!finded) {
      throw new NotFoundException(`Customer ${id} was not found`);
    }

    return finded;
  }

  async findOneByLoginOrEmail(loginOrEmail: string): Promise<CustomerEntity> {
    return this.customerRepository.findOne({
      where: [
        {
          email: loginOrEmail,
        },
        {
          login: loginOrEmail,
        },
      ],
    });
  }

  async update(id: string, customerDto: UpdateCustomerDto): Promise<string> {
    await this.findOne(id);

    await this.customerRepository.update(
      {
        id,
      },
      customerDto,
    );

    return id;
  }

  async delete(id: string) {
    await this.findOne(id);
    await this.customerRepository.delete({
      id,
    });
  }
}
