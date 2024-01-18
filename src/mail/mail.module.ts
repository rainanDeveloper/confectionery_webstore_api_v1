import { Module, forwardRef } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mail.service';
import { CustomerModule } from 'src/customer/customer.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const secure = configService.getOrThrow('SMTP_SECURE') === 'true';
        const config = {
          transport: {
            host: configService.getOrThrow('SMTP_HOST'),
            port: parseInt(configService.getOrThrow('SMTP_PORT')),
            secure,
            auth: {
              user: configService.getOrThrow('SMTP_USER'),
              pass: configService.getOrThrow('SMTP_PASS'),
            },
          },
          template: {
            dir: join(process.cwd(), 'src', 'mail', 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
        return config;
      },
      inject: [ConfigService],
    }),
    forwardRef(() => CustomerModule),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
