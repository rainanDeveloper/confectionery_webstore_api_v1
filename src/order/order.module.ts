import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderService } from './order.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([OrderEntity])],
  providers: [OrderService],
})
export class OrderModule {}
