import { PrismaService } from '@app/prisma';
import { Injectable, Req } from '@nestjs/common';
import { IUserRequest } from 'common/interfaces';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async connectServiceOnUser(@Req() request: IUserRequest, serviceId: string) {
    const user = request['user'];
    const userId = user?.userId;
    await this.prisma.servicesOnUsers.create({
      data: {
        service: {
          connect: {
            id: serviceId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return {
      success: true,
    };
  }

  async listServices() {
    const services = await this.prisma.services.findMany();

    return {
      success: true,
      data: services,
    };
  }

  async listServicesByUser(@Req() request: IUserRequest) {
    const user = request['user'];
    const userId = user?.userId;
    const services = await this.prisma.servicesOnUsers.findMany({
      where: {
        userId,
      },
      include: {
        service: true,
      },
    });

    return {
      success: true,
      data: services,
    };
  }
}
