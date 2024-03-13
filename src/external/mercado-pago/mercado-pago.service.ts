import { Injectable, Logger } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { CreatePreferenceDto } from './dto/create-preference.dto';

@Injectable()
export class MercadoPagoService {
  private static instance: MercadoPagoService;
  private mercadoPagoClient: MercadoPagoConfig;
  private readonly logger = new Logger(MercadoPagoService.name);
  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new MercadoPagoService();
    }
    return this.instance;
  }

  configure(accessToken) {
    this.mercadoPagoClient = new MercadoPagoConfig({
      accessToken,
    });
  }

  canActivate() {
    if (!this.mercadoPagoClient) {
      const message = `É necessário ter configurado o client com as credenciais do mercado pago para realizar essa operação`;
      this.logger.error(message);
      throw new Error(message);
    }
  }

  async createPreference(createPreferenceDto: CreatePreferenceDto) {
    this.canActivate();
    const preference = new Preference(this.mercadoPagoClient);

    const { init_point, sandbox_init_point } = await preference.create({
      body: createPreferenceDto,
    });

    return {
      init_point,
      sandbox_init_point,
    };
  }
}
