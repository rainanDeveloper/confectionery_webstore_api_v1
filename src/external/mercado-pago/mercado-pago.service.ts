import { Injectable } from '@nestjs/common';

@Injectable()
export class MercadoPagoService {
  private static instance: MercadoPagoService;
  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new MercadoPagoService();
    }
    return this.instance;
  }
}
