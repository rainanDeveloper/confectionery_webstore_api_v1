import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { MailModule } from 'src/mail/mail.module';
import { CustomerOtpService } from './customer-otp.service';
import { CustomerOtpEntity } from './entities/customer-otp.entity';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => MailModule),
    TypeOrmModule.forFeature([CustomerEntity, CustomerOtpEntity]),
  ],
  providers: [CustomerService, CustomerOtpService],
  controllers: [CustomerController],
  exports: [CustomerService, CustomerOtpService],
})
export class CustomerModule {}
