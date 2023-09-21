import { Injectable, Req } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { Prisma } from '@prisma/client';
import {
  GlycemicControl,
  IUserRequest,
  Response,
  ResponseError,
  ResponseWithData,
} from 'common/interfaces';

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

  private getAverageGlycemic(glycemic: Prisma.GlycemicWhereInput[]): number {
    const sum = glycemic.reduce(
      (acc, curr) => (typeof curr.value === 'number' ? acc + curr.value : 0),
      0,
    );
    return (sum / glycemic.length).toFixed(2) as any;
  }

  private getMaxGlycemic(glycemic: Prisma.GlycemicWhereInput[]): number {
    return Math.max(
      ...glycemic.map((glycemic) => {
        if (typeof glycemic.value === 'number') {
          return glycemic.value;
        }
        return 0;
      }),
    );
  }

  private getMinGlycemic(glycemic: Prisma.GlycemicWhereInput[]): number {
    return Math.min(
      ...glycemic.map((glycemic) => {
        if (typeof glycemic.value === 'number') {
          return glycemic.value;
        }
        return 0;
      }),
    );
  }

  async insertGlucoseControl(
    @Req() request: IUserRequest,
    data: Pick<Prisma.GlycemicCreateInput, 'value' | 'fasting'>,
  ): Promise<Response | ResponseError> {
    const user = request['user'];
    const userId = user?.userId;
    const insert = await this.prisma.glycemic.create({
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
    if (!insert) {
      return {
        success: false,
        error: {
          message: 'Error to insert glycemic control',
        },
      };
    }
    return {
      success: true,
    };
  }

  async getGlycemicControl(
    @Req() request: IUserRequest,
    startDate: string,
    endDate: string,
  ): Promise<ResponseWithData<GlycemicControl>> {
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

    return {
      success: true,
      data: {
        glycemic,
        average: this.getAverageGlycemic(glycemic),
        max: this.getMaxGlycemic(glycemic),
        min: this.getMinGlycemic(glycemic),
      },
    };
  }
}
