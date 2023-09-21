import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([OrderEntity])],
})
export class OrderModule {}
