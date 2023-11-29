import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([CartEntity])],
})
export class CartModule {}
