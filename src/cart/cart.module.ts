import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { CartService } from './cart.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([CartEntity])],
  providers: [CartService],
})
export class CartModule {}
