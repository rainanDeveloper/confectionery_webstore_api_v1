import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItemEntity } from './entities/cart-item.entity';
import { CartItemService } from './cart-item.service';
import { ProductModule } from 'src/product/product.module';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([CartItemEntity]),
    ProductModule,
    forwardRef(() => CartModule),
  ],
  providers: [CartItemService],
  exports: [CartItemService],
})
export class CartItemModule {}
