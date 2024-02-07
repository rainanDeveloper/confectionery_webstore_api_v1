import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderItemService } from './order-item.service';
import { OrderModule } from 'src/order/order.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([OrderItemEntity]),
    forwardRef(() => OrderModule),
    ProductModule,
  ],
  providers: [OrderItemService],
  exports: [OrderItemService],
})
export class OrderItemModule {}
