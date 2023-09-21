import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { PrismaModule } from '@app/prisma';
import { AuthModule } from '@app/auth';
import { UserService } from '../core/user/user.service';
import { LocalStrategy } from './local-strategy/local.auth';
import { AuthService } from '@app/auth';
import { AuthenticationController } from './authenticantion.controller';
import { AuthenticationService } from './authenticantion.service';

@Module({
  imports: [PrismaModule, PassportModule, JwtModule, AuthModule],
  providers: [AuthService, UserService, AuthenticationService, LocalStrategy],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
