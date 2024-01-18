import { Inject, Injectable } from '@nestjs/common';
import { CustomerConfirmationDto } from './dtos/customer-confirmation.dto';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import { CustomerOtpService } from 'src/customer/customer-otp.service';

@Injectable()
export class MailService {
  constructor(
    @Inject(MailerService) private readonly mailerService: MailerService,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(CustomerOtpService)
    private readonly customerOtpService: CustomerOtpService,
  ) {}

  async sendCustomerConfirmationEmail(
    customerConfirmationDto: CustomerConfirmationDto,
  ) {
    const otp = randomUUID();

    await this.customerOtpService.create({
      otp,
      email: customerConfirmationDto.email,
    });

    const otp_url = `${this.configService.getOrThrow(
      'APPLICATION_HOST',
    )}/confirmEmail/${otp}`;

    this.mailerService.sendMail({
      to: customerConfirmationDto.email,
      from: this.configService.getOrThrow('SMTP_EMAIL'),
      subject: 'Confirm your email',
      template: 'customer-email-confirmation',
      context: {
        customer: customerConfirmationDto,
        otp_url,
      },
    });
  }
}
