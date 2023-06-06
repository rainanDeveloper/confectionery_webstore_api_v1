import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService, HealthDto } from './app.service';

@Controller()
@ApiTags('Health Check')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHealth(): HealthDto {
    return this.appService.getHealth();
  }
}
