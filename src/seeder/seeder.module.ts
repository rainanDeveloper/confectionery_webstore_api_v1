import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { SeederService } from './seeder.service';
import { PaymentMethodModule } from 'src/payment-method/payment-method.module';

@Module({
  imports: [UserModule, PaymentMethodModule],
  providers: [SeederService],
})
export class SeederModule {}
