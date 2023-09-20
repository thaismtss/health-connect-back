import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { PrismaModule } from '@app/prisma';

@Module({
  imports: [PrismaModule, PassportModule, JwtModule],
  providers: [AuthService],
})
export class AuthModule {}
