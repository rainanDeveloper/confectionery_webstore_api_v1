import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import { CustomerConfirmationDto } from './dtos/customer-confirmation.dto';
import { CustomerOtpService } from 'src/customer/customer-otp.service';
import { randomUUID } from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';

describe('MailService', () => {
  let mailService: MailService;
  let mailerService: MailerService;
  let configService: ConfigService;
  let customerOtpService: CustomerOtpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockResolvedValue('https://test.com'),
          },
        },
        {
          provide: CustomerOtpService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    mailService = module.get<MailService>(MailService);
    mailerService = module.get<MailerService>(MailerService);
    configService = module.get<ConfigService>(ConfigService);
    customerOtpService = module.get<CustomerOtpService>(CustomerOtpService);
  });

  it('should be defined', () => {
    expect(mailService).toBeDefined();
    expect(mailerService).toBeDefined();
    expect(configService).toBeDefined();
    expect(customerOtpService).toBeDefined();
  });

  describe('sendCustomerConfirmationEmail', () => {
    it('Should send email confirmation to customer', async () => {
      const customerConfirmationDto: CustomerConfirmationDto = {
        login: 'some_user',
        email: 'some_user@email.example',
      };

      const result = await mailService.sendCustomerConfirmationEmail(
        customerConfirmationDto,
      );

      expect(result).not.toBeDefined();
      expect(customerOtpService.create).toHaveBeenCalledTimes(1);
      expect(customerOtpService.create).toHaveBeenCalledWith({
        otp: expect.any(String),
        email: customerConfirmationDto.email,
      });
      expect(mailerService.sendMail).toHaveBeenCalledTimes(1);
      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: customerConfirmationDto.email,
        subject: 'Confirm your email',
        template: 'customer-email-confirmation',
        context: {
          customer: customerConfirmationDto,
          otp_url: expect.any(String),
        },
      });
    });
  });
});
