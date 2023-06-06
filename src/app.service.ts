import { Injectable } from '@nestjs/common';
import { name, version, description } from '../package.json';

export interface HealthDto {
  app_name: string;
  version: string;
  description: string;
  status: string;
}

@Injectable()
export class AppService {
  getHealth(): HealthDto {
    return {
      app_name: name,
      version,
      description,
      status: 'Ok',
    };
  }
}
