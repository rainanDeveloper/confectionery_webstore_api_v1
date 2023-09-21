import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemEntity } from './entities/order-item.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([OrderItemEntity])],
})
export class OrderItemModule {}
