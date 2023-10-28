import { PrismaService } from '@app/prisma';
import { Injectable, Req } from '@nestjs/common';
import {
  IUserRequest,
  Response,
  ResponseWithData,
  Services,
} from 'common/interfaces';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async connectServiceOnUser(
    @Req() request: IUserRequest,
    serviceId: string,
  ): Promise<Response> {
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

  async listServices(): Promise<ResponseWithData<Services[]>> {
    const services = await this.prisma.services.findMany();

    return {
      success: true,
      data: services,
    };
  }

  async listServicesByUser(
    @Req() request: IUserRequest,
  ): Promise<ResponseWithData<Services[]>> {
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
      data: services.map((service) => ({
        ...service.service,
      })),
    };
  }
}
