import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { CartService } from './cart.service';
import { CartItemModule } from 'src/cart-item/cart-item.module';
import { CartController } from './cart.controller';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([CartEntity]),
    forwardRef(() => CartItemModule),
  ],
  providers: [CartService],
  exports: [CartService],
  controllers: [CartController],
})
export class CartModule {}
