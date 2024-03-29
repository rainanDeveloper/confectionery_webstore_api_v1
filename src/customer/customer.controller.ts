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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { NotFoundErrorDto } from 'src/helpers/not_found_error.helpers';
import { ValidationErrorDto } from 'src/helpers/validation.helpers';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { GetCustomerDto } from './dtos/get-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { AuthGuard } from '@nestjs/passport';

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
    @Req() request: Request,
    @Body() customerDto: CreateCustomerDto,
    @Res() response: Response,
  ) {
    const langs = request.headers['accept-language']?.split(';')[0]?.split(',');
    const customerId = await this.customerService.create(customerDto, langs);

    const getUrl = `customer/${customerId}`;

    response.header('location', getUrl).status(HttpStatus.CREATED).send();
  }

  @Get('confirmEmail/:otp')
  @ApiNoContentResponse({
    description: 'NO CONTENT: Customer activated sucessfully',
  })
  @ApiNotFoundResponse({
    description: 'NOT FOUND: otp/customer not found',
    type: NotFoundErrorDto,
  })
  async confirmEmail(@Param('otp') otp: string) {
    await this.customerService.activateUser(otp);
    return;
  }

  @Get()
  @ApiOkResponse({
    description: 'OK: Finded a customer sucessfully and returned it',
    type: GetCustomerDto,
  })
  @ApiNotFoundResponse({
    description: "NOT FOUND: customer with informed id wasn't found",
    type: NotFoundErrorDto,
  })
  @UseGuards(AuthGuard('jwt-customer'))
  @ApiBearerAuth()
  async findOne(@Req() request: Request) {
    const user = request.user as any;
    return await this.customerService.findOne(user.id);
  }

  @Patch()
  @ApiNoContentResponse({
    description: 'NO CONTENT: Customer updated sucessfully',
  })
  @ApiNotFoundResponse({
    description: "NOT FOUND: customer with informed id wasn't found",
    type: NotFoundErrorDto,
  })
  @UseGuards(AuthGuard('jwt-customer'))
  @ApiBearerAuth()
  async update(
    @Req() request: Request,
    @Body() customerDto: UpdateCustomerDto,
    @Res() response: Response,
  ) {
    const user = request.user as any;

    await this.customerService.update(user.id, customerDto);
    const getUrl = `customer/${user.id}`;

    response.header('location', getUrl).status(HttpStatus.NO_CONTENT).send();
    return;
  }

  @Delete()
  @ApiNoContentResponse({
    description: 'NO CONTENT: Customer deleted sucessfully',
  })
  @ApiNotFoundResponse({
    description: "NOT FOUND: customer with informed id wasn't found",
    type: NotFoundErrorDto,
  })
  @UseGuards(AuthGuard('jwt-customer'))
  @ApiBearerAuth()
  async delete(@Req() request: Request) {
    const user = request.user as any;

    await this.customerService.delete(user.id);

    return;
  }
}
