import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItemEntity } from './entities/cart-item.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([CartItemEntity])],
})
export class CartItemModule {}
