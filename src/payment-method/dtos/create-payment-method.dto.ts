export class CreatePaymentMethodDto {
  reference: string;
  name: string;
  status?: boolean;
  applicationKey?: string;
}
