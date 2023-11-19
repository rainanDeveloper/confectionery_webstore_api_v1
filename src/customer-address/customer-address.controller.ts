import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { CustomerAddressService } from './customer-address.service';
import { Response } from 'express';
import { CreateCustomerAddressControllerDto } from './dtos/create-customer-address-controller.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Customer')
@Controller('customer-address')
export class CustomerAddressController {
  constructor(
    @Inject(CustomerAddressService)
    private readonly customerAddressService: CustomerAddressService,
  ) {}

  @Post(':customerId')
  async create(
    @Param('customerId') customerId: string,
    @Body() createCustomerAddressDto: CreateCustomerAddressControllerDto,
    @Res() response: Response,
  ) {
    const customerAddresId = await this.customerAddressService.create({
      ...createCustomerAddressDto,
      customer: {
        id: customerId,
      },
    });

    const getUrl = `customer-address/${customerId}/${customerAddresId}`;

    response.header('location', getUrl).status(HttpStatus.CREATED).send();

    return;
  }
}
