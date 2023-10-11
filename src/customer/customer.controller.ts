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
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { NotFoundErrorDto } from 'src/helpers/not_found_error.helpers';
import { ValidationErrorDto } from 'src/helpers/validation.helpers';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { GetCustomerDto } from './dtos/get-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(
    @Inject(CustomerService) private readonly customerService: CustomerService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    description: 'CREATED: Element created sucessfully',
  })
  @ApiBadRequestResponse({
    description: 'BAD REQUEST: Some validation error occurred',
    type: ValidationErrorDto,
  })
  async create(
    @Body() customerDto: CreateCustomerDto,
    @Res() response: Response,
  ) {
    const customerId = await this.customerService.create(customerDto);

    const getUrl = `customer/${customerId}`;

    response.header('location', getUrl).status(HttpStatus.CREATED).send();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'OK: Finded a customer sucessfully and returned it',
    type: GetCustomerDto,
  })
  @ApiNotFoundResponse({
    description: "NOT FOUND: customer with informed id wasn't found",
    type: NotFoundErrorDto,
  })
  async findOne(@Param('id') id: string) {
    return await this.customerService.findOne(id);
  }

  @Patch(':id')
  @ApiNoContentResponse({
    description: 'NO CONTENT: Customer updated sucessfully',
  })
  @ApiNotFoundResponse({
    description: "NOT FOUND: customer with informed id wasn't found",
    type: NotFoundErrorDto,
  })
  async update(
    @Param('id') id: string,
    @Body() customerDto: UpdateCustomerDto,
    @Res() response: Response,
  ) {
    await this.customerService.update(id, customerDto);
    const getUrl = `customer/${id}`;

    response.header('location', getUrl).status(HttpStatus.NO_CONTENT).send();
    return;
  }

  @Delete(':id')
  @ApiNoContentResponse({
    description: 'NO CONTENT: Customer deleted sucessfully',
  })
  @ApiNotFoundResponse({
    description: "NOT FOUND: customer with informed id wasn't found",
    type: NotFoundErrorDto,
  })
  async delete(@Param('id') id: string) {
    await this.customerService.delete(id);

    return;
  }
}
