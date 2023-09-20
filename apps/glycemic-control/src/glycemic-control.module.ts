import { Module } from '@nestjs/common';
import { GlycemicControlController } from './glycemic-control.controller';
import { GlycemicControlService } from './glycemic-control.service';
import { PrismaModule } from '@app/prisma';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, PassportModule, JwtModule.register({ global: true })],
  controllers: [GlycemicControlController],
  providers: [GlycemicControlService],
})
export class GlycemicControlModule {}
