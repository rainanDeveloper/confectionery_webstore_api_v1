import { CreatePaymentMethodDto } from 'src/payment-method/dtos/create-payment-method.dto';

export const createPaymentMethodDtos: CreatePaymentMethodDto[] = [
  {
    reference: 'MERCADOPAGO',
    name: 'Mercado Pago',
  },
  {
    reference: 'BTC',
    name: 'Bitcoin',
  },
];
