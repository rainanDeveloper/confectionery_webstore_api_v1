import { Inject, Injectable } from '@nestjs/common';
import { CustomerConfirmationDto } from './dtos/customer-confirmation.dto';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(
    @Inject(MailerService) private readonly mailerService: MailerService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  async sendCustomerConfirmationEmail(
    customerConfirmationDto: CustomerConfirmationDto,
  ) {
    const otp = randomUUID();

    const otp_url = `${this.configService.getOrThrow(
      'APPLICATION_HOST',
    )}/confirmEmail/${otp}`;

    this.mailerService.sendMail({
      to: customerConfirmationDto.email,
      subject: 'Confirm your email',
      template: 'customer-email-confirmation',
      context: {
        customer: customerConfirmationDto,
        otp_url,
      },
    });
  }
}
