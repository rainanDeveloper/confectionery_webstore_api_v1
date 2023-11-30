import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItemEntity } from './entities/cart-item.entity';
import { CartItemService } from './cart-item.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([CartItemEntity])],
  providers: [CartItemService],
})
export class CartItemModule {}
