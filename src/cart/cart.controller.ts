import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartControllerDto } from './dtos/create-cart-controller.dto';
import { Request } from 'express';
import {
  CartItemLinksDto,
  CreateCartServiceDto,
} from './dtos/create-cart-service.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OptionalJwtCustomerGuard } from 'src/customer-auth/guards/optional-jwt-customer.guard';
import { CartEntity } from './entities/cart.entity';
import { CartItemService } from 'src/cart-item/cart-item.service';

@Controller('cart')
@ApiTags('Cart')
@UseGuards(OptionalJwtCustomerGuard)
@ApiBearerAuth()
export class CartController {
  constructor(
    @Inject(CartService) private readonly cartService: CartService,
    @Inject(CartItemService) private readonly cartItemService: CartItemService,
  ) {}

  @Post()
  async create(
    @Req() request: Request,
    @Body() createCartControllerDto: CreateCartControllerDto,
  ) {
    const user = request.user as any;

    const createCartServiceDto: CreateCartServiceDto = {
      itens: createCartControllerDto.itens,
    };

    if (user) {
      createCartServiceDto.customer = {
        id: user.id,
      };
    }

    const cartId = await this.cartService.create(createCartServiceDto);

    return { id: cartId };
  }

  @Get()
  async findOne(
    @Req() request: Request,
    @Query('id') id?: string,
  ): Promise<CartEntity> {
    const user = request.user as any;

    if (user) {
      return this.cartService.findAnyOpenForCustomer(user.id, true);
    }

    return this.cartService.findOne(id, true);
  }

  @Put('add')
  async addItem(
    @Req() request: Request,
    @Body() cartItemDto: CartItemLinksDto,
    @Query('id') id?: string,
  ) {
    let existentCart: CartEntity;
    const user = request.user as any;

    if (user) {
      existentCart = await this.cartService.findAnyOpenForCustomer(
        user.id,
        true,
      );
    }

    if (id) existentCart = await this.cartService.findOne(id, true);

    if (!existentCart) throw new NotFoundException(`Carrinho não encontrado`);

    const item = await this.cartItemService.create({
      ...cartItemDto,
      cart: {
        id: existentCart.id,
      },
    });

    await this.cartService.updateTotal(existentCart.id);

    return item;
  }

  @Delete('remove/:itemId')
  async removeItem(
    @Req() request: Request,
    @Param('itemId') itemId: string,
    @Query('id') id?: string,
  ) {
    let existentCart: CartEntity;
    const user = request.user as any;

    if (user) {
      existentCart = await this.cartService.findAnyOpenForCustomer(
        user.id,
        false,
      );
    }

    if (id) existentCart = await this.cartService.findOne(id, false);

    if (!existentCart) throw new NotFoundException(`Carrinho não encontrado`);

    const existentItem = await this.cartItemService.findOneByIdAndCart(
      itemId,
      existentCart.id,
    );

    if (!existentItem)
      throw new NotFoundException(
        `Não foi possível encontrar o item ${itemId} do carrinho ${id}`,
      );

    await this.cartItemService.delete(itemId);

    await this.cartService.updateTotal(existentCart.id);

    return;
  }
}
