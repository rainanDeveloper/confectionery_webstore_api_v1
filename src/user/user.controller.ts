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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserBodyResponseDto } from './dtos/user-body-response.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
import { Response } from 'express';

@Controller('user')
@ApiTags('User')
@UseGuards(AuthGuard('jwt-user'))
@ApiBearerAuth()
export class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @Post()
  @ApiOkResponse({
    type: UserBodyResponseDto,
  })
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  async create(
    @Res() response: Response,
    @Body() createUserDto: CreateUserDto,
  ): Promise<undefined> {
    const userId = await this.userService.create(createUserDto);

    const getUrl = `user/${userId}`;

    response.header('location', getUrl).status(HttpStatus.CREATED).send();
    return;
  }

  @Get()
  @ApiOkResponse({
    type: Array<UserBodyResponseDto>,
  })
  async findAll(): Promise<UserBodyResponseDto[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: UserBodyResponseDto,
  })
  async find(@Param('id') id: string): Promise<UserEntity> {
    return await this.userService.findOneById(id);
  }

  @Patch(':id')
  @ApiNoContentResponse()
  @ApiInternalServerErrorResponse()
  async updateOne(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<void> {
    return await this.userService.updateOne(id, updateUserDto);
  }

  @Delete(':id')
  @ApiNoContentResponse()
  @ApiInternalServerErrorResponse()
  async deleteOne(@Param('id') id: string) {
    await this.userService.deleteOne(id);
  }
}
