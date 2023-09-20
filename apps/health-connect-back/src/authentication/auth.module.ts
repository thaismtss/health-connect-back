import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';

import { AuthController } from './auth.controller';

import { PrismaModule } from '@app/prisma';
import { AuthModule as AuthenticationModule } from '@app/auth';
import { UserService } from '../core/user/user.service';
import { LocalStrategy } from './local-strategy/local.auth';
import { AuthService as AuthenticationService } from '@app/auth';

@Module({
  imports: [PrismaModule, PassportModule, JwtModule, AuthenticationModule],
  providers: [AuthService, UserService, AuthenticationService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
