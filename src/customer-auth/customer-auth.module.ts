import { Module } from '@nestjs/common';
import { CustomerAuthService } from './customer-auth.service';
import { CustomerModule } from 'src/customer/customer.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CustomerAuthController } from './customer-auth.controller';
import { AuthCustomerStrategy } from './strategies/auth-customer.strategy';

@Module({
  imports: [
    CustomerModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.getOrThrow('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRESIN') || '2h',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [CustomerAuthService, AuthCustomerStrategy],
  controllers: [CustomerAuthController],
})
export class CustomerAuthModule {}
