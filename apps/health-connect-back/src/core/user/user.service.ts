import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async registerUser(
    data: Prisma.UserCreateInput,
  ): Promise<{ success: boolean }> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(data.password, saltOrRounds);

    if (user) {
      throw new Error('User already exists');
    }

    await this.prisma.user.create({
      data: {
        ...data,
        password: hash,
      },
    });

    return {
      success: true,
    };
  }

  findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
