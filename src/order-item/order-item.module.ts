import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderItemService } from './order-item.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([OrderItemEntity])],
  providers: [OrderItemService],
})
export class OrderItemModule {}
