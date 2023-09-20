import { NestFactory } from '@nestjs/core';
import { GlycemicControlModule } from './glycemic-control.module';

async function bootstrap() {
  const app = await NestFactory.create(GlycemicControlModule);
  await app.listen(4000);
}
bootstrap();
