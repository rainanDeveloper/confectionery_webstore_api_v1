import { Module } from '@nestjs/common';
import { CustomerAuthService } from './customer-auth.service';

@Module({
  providers: [CustomerAuthService]
})
export class CustomerAuthModule {}
