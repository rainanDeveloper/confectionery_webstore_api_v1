import { Test, TestingModule } from '@nestjs/testing';
import { MercadoPagoService } from './mercado-pago.service';

describe('MercadoPagoService', () => {
  const mercadoPagoSingletonInstance = MercadoPagoService.getInstance();

  it('should be defined', () => {
    expect(mercadoPagoSingletonInstance).toBeDefined();
  });
});
