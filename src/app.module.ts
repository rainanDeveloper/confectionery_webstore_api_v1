import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SeederModule } from './seeder/seeder.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { OrderItemModule } from './order-item/order-item.module';
import { CustomerModule } from './customer/customer.module';
import { CustomerAddressModule } from './customer-address/customer-address.module';
import { CustomerAuthModule } from './customer-auth/customer-auth.module';
import { CartModule } from './cart/cart.module';
import { CartItemModule } from './cart-item/cart-item.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CartCronJobsService } from './cart-cron-jobs/cart-cron-jobs.service';
import { CartCronJobsModule } from './cart-cron-jobs/cart-cron-jobs.module';
import { MailModule } from './mail/mail.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('DB_HOST'),
        port: configService.getOrThrow('DB_PORT'),
        username: configService.getOrThrow('DB_USERNAME'),
        password: configService.getOrThrow('DB_PASSWORD'),
        database: configService.getOrThrow('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    SeederModule,
    AuthModule,
    ProductModule,
    CategoryModule,
    OrderModule,
    OrderItemModule,
    CustomerModule,
    CustomerAddressModule,
    CustomerAuthModule,
    CartModule,
    CartItemModule,
    CartCronJobsModule,
    MailModule,
    PaymentMethodModule,
  ],
  controllers: [AppController],
  providers: [AppService, CartCronJobsService],
})
export class AppModule {}
