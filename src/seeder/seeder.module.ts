import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { SeederService } from './seeder.service';

@Module({
  imports: [UserModule],
  providers: [SeederService],
})
export class SeederModule {}
