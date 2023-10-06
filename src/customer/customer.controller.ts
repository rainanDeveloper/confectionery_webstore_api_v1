import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(
    @Inject(CustomerService) private readonly customerService: CustomerService,
  ) {}

  @Post()
  async create(
    @Body() customerDto: CreateCustomerDto,
    @Res() response: Response,
  ) {
    const customerId = await this.customerService.create(customerDto);

    const getUrl = `customer/${customerId}`;

    response.header('location', getUrl).send();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.customerService.findOne(id);
  }
}
