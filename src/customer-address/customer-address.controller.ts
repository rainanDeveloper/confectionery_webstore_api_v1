import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CustomerAddressService } from './customer-address.service';
import { Request, Response } from 'express';
import { CreateCustomerAddressControllerDto } from './dtos/create-customer-address-controller.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CustomerAddressEntity } from './entities/customer-address.entity';
import { UpdateCustomerAddressDto } from './dtos/update-customer-address.dto';

@ApiTags('Customer Address')
@Controller('customer-address')
@UseGuards(AuthGuard('jwt-customer'))
@ApiBearerAuth()
export class CustomerAddressController {
  constructor(
    @Inject(CustomerAddressService)
    private readonly customerAddressService: CustomerAddressService,
  ) {}

  @Post()
  async create(
    @Body() createCustomerAddressDto: CreateCustomerAddressControllerDto,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const user = request.user as any;

    if (!user)
      throw new UnauthorizedException(
        "You're not allowed to perform this action",
      );
    const customerAddresId = await this.customerAddressService.create({
      ...createCustomerAddressDto,
      customer: {
        id: user.id,
      },
    });

    const getUrl = `customer-address/${customerAddresId}`;

    response.header('location', getUrl).status(HttpStatus.CREATED).send();

    return;
  }

  @Get()
  async findAll(@Req() request: Request): Promise<CustomerAddressEntity[]> {
    const user = request.user as any;

    return this.customerAddressService.findAll(user.id);
  }

  @Get(':id')
  async findOne(@Req() request: Request, @Param('id') id: string) {
    const user = request.user as any;

    return this.customerAddressService.findOne(user.id, id);
  }

  @Patch(':id')
  async update(
    @Req() request,
    @Param('id') id: string,
    @Body() updateCustomerAddressDto: UpdateCustomerAddressDto,
    @Res() response: Response,
  ) {
    const user = request.user as any;
    await this.customerAddressService.update(
      user.id,
      id,
      updateCustomerAddressDto,
    );

    const getUrl = `customer-address/${id}`;

    response.header('location', getUrl).status(HttpStatus.NO_CONTENT).send();
    return;
  }

  @Delete(':id')
  async delete(
    @Req() request,
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    const user = request.user as any;
    await this.customerAddressService.delete(user.id, id);

    response.status(HttpStatus.NO_CONTENT).send();

    return;
  }
}
