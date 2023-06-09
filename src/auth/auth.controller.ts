import { Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { UserEntity } from 'src/user/entities/user.entity';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiBody({
    type: LoginDto,
  })
  async login(@Req() request: Request) {
    return await this.authService.login(request.user as UserEntity);
  }
}
