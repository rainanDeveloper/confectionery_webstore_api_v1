import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { UserService } from '../user/user.service';
import { PaymentMethodService } from 'src/payment-method/payment-method.service';
import { CreatePaymentMethodDto } from 'src/payment-method/dtos/create-payment-method.dto';
import { createPaymentMethodDtos } from './constants/payment-methods.constant';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeederService.name);
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(PaymentMethodService)
    private readonly paymentMethodService: PaymentMethodService,
  ) {}

  async onApplicationBootstrap() {
    const startTime = performance.now();

    const endTime = performance.now();

    await this.seedUsers();

    await this.seedPaymentMethods();

    const elapsed = Number.parseInt((endTime - startTime).toString());

    this.logger.log(`Database seed done +${elapsed}ms`);
  }

  private async seedUsers() {
    const users = await this.userService.findAll();

    if (users.length < 1) {
      this.logger.log(`Seeding database with default user`);
      const userDto: CreateUserDto = {
        login: 'admin',
        email: 'admin@email.example',
        password: 'admin123',
      };

      await this.userService.create(userDto);
    }
  }

  private async seedPaymentMethods() {
    const paymentMethods = await this.paymentMethodService.findAll();

    if (paymentMethods.length < 1) {
      this.logger.log(`Seeding database with default payment methods`);

      for (let i = 0; i < createPaymentMethodDtos.length; i++) {
        await this.paymentMethodService.create(createPaymentMethodDtos[i]);
      }
    }
  }
}
