import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderService } from './order.service';
import { CartModule } from 'src/cart/cart.module';
import { OrderItemModule } from 'src/order-item/order-item.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([OrderEntity]),
    CartModule,
    forwardRef(() => OrderItemModule),
  ],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
