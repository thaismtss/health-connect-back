import { Module } from '@nestjs/common';
import { UserModule } from './core/user/user.module';

import { PrismaModule } from '@app/prisma';
import { AuthenticationModule } from './authentication/authentication.module';
import { AuthModule } from '@app/auth';
import { ServicesModule } from './core/services/services.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    ServicesModule,
    AuthenticationModule,
    PrismaModule,
    AuthModule,
    JwtModule.register({ global: true }),
  ],
})
export class AppModule {}
