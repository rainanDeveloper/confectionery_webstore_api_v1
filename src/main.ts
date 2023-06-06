import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { name, version, description } from '../package.json';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const configService = new ConfigService();

  const PORT = Number.parseInt(configService.get('APP_PORT') || '8080');

  const EXPOSE_DOCS = Boolean(configService.get('EXPOSE_DOCS'));

  if (EXPOSE_DOCS) {
    let title = name[0].toUpperCase() + name.slice(1);

    title = title.replace(/_/g, ' ');

    const config = new DocumentBuilder()
      .setTitle(title)
      .setDescription(description)
      .setVersion(version)
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(PORT);
}
bootstrap();
