import { Injectable } from '@nestjs/common';
import * as mercadopago from 'mercadopago';

@Injectable()
export class MercadoPagoService {
  private static instance: MercadoPagoService;
  public mercadoPago;
  private constructor() {
    this.mercadoPago = mercadopago;
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new MercadoPagoService();
    }
    return this.instance;
  }
}
