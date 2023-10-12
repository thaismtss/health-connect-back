import { NestFactory } from '@nestjs/core';
import { GlycemicControlModule } from './glycemic-control.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(GlycemicControlModule);

  const config = new DocumentBuilder()
    .setTitle('Glycemic Control')
    .setDescription('Glycemic Control API description')
    .setVersion('1.0')
    .addTag('glycemic-control')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(4000);
}
bootstrap();
