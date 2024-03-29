import { Module } from '@nestjs/common';
import { CustomerAuthService } from './customer-auth.service';
import { CustomerModule } from 'src/customer/customer.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CustomerAuthController } from './customer-auth.controller';
import { AuthCustomerStrategy } from './strategies/auth-customer.strategy';
import { JwtStrategy } from './strategies/jwt-customer.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CustomerModule,
    PassportModule,
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
  providers: [CustomerAuthService, AuthCustomerStrategy, JwtStrategy],
  controllers: [CustomerAuthController],
})
export class CustomerAuthModule {}
