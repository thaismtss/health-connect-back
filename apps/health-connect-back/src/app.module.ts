import { Module } from '@nestjs/common';
import { UserModule } from './core/user/user.module';

import { PrismaModule } from '@app/prisma';
import { AuthModule } from './authentication/auth.module';
import { AuthModule as AuthenticationModule } from '@app/auth';

@Module({
  imports: [UserModule, AuthModule, PrismaModule, AuthenticationModule],
})
export class AppModule {}
