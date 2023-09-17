import { Module } from '@nestjs/common';
import { UserModule } from './core/user/user.module';
import { AuthModule } from './authentication/auth/auth.module';
import { PrismaModule } from './database/prisma/prisma.module';

@Module({
  imports: [UserModule, AuthModule, PrismaModule],
})
export class AppModule {}
