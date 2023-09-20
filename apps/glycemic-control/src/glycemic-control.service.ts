import { Injectable, Req } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { Prisma } from '@prisma/client';
import { IUserRequest } from 'common/interfaces';

@Injectable()
export class GlycemicControlService {
  constructor(private readonly prisma: PrismaService) {}

  private getStatusGlycemic(value: number, fasting: boolean): string {
    const thresholds = {
      fasting: {
        HIPLOGLICEMIA: value < 70,
        NORMAL: value <= 100,
        PREDIABETES: value <= 126,
        DIABETES: true,
      },
      nonFasting: {
        NORMAL: value <= 70,
        PREDIABETES: value <= 140,
        DIABETES: true,
      },
    };

    const status = fasting ? thresholds.fasting : thresholds.nonFasting;

    for (const key in status) {
      if (status[key]) {
        return key;
      }
    }

    return 'DIABETES';
  }

  async insertGlucoseControl(
    @Req() request: IUserRequest,
    data: Pick<Prisma.GlycemicCreateInput, 'value' | 'fasting'>,
  ): Promise<any> {
    const user = request['user'];
    const userId = user?.userId;
    await this.prisma.glycemic.create({
      data: {
        ...data,
        status: this.getStatusGlycemic(data.value, data.fasting),
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

  async getGlycemicControl(
    @Req() request: IUserRequest,
    startDate: string,
    endDate: string,
  ): Promise<any> {
    const user = request['user'];
    const userId = user?.userId;
    const glycemic = await this.prisma.glycemic.findMany({
      where: {
        userId,
        createdAt: {
          gte:
            new Date(startDate).toISOString().split('T')[0] + 'T00:00:00.000Z',
          lte: new Date(endDate).toISOString().split('T')[0] + 'T23:59:59.000Z',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return glycemic;
  }
}
