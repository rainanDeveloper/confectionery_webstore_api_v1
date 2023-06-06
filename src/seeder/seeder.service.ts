import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeederService.name);
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  async onApplicationBootstrap() {
    const startTime = performance.now();

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

    const endTime = performance.now();

    const elapsed = Number.parseInt((endTime - startTime).toString());

    this.logger.log(`Database seed done +${elapsed}ms`);
  }
}
