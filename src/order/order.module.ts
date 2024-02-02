import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderService } from './order.service';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([OrderEntity]), CartModule],
  providers: [OrderService],
})
export class OrderModule {}
