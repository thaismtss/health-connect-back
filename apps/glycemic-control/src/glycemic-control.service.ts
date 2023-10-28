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

  private getStatusGlycemic(value: string, fasting: boolean): string {
    const parsedValue = parseFloat(value);
    const thresholds = {
      fasting: {
        HIPLOGLICEMIA: parsedValue < 70,
        NORMAL: parsedValue <= 100,
        PREDIABETES: parsedValue <= 126,
        DIABETES: true,
      },
      nonFasting: {
        NORMAL: parsedValue <= 70,
        PREDIABETES: parsedValue <= 140,
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
    const sum = glycemic.reduce((acc, curr) => acc + Number(curr.value), 0);
    return (sum / glycemic.length).toFixed(2) as any;
  }

  private getMaxGlycemic(glycemic: Prisma.GlycemicWhereInput[]): number {
    return Math.max(
      ...glycemic.map((glycemic) => {
        return Number(glycemic.value);
      }),
    );
  }

  private getMinGlycemic(glycemic: Prisma.GlycemicWhereInput[]): number {
    return Math.min(
      ...glycemic.map((glycemic) => {
        return Number(glycemic.value);
      }),
    );
  }

  private getDate(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR').format(date);
  }

  private getTime(date: Date): string {
    const newDate = new Date(date).setHours(date.getHours() - 3);
    return new Intl.DateTimeFormat('pt-BR', {
      hour: 'numeric',
      minute: 'numeric',
    }).format(newDate);
  }

  async insertGlucoseControl(
    @Req() request: IUserRequest,
    data: Pick<Prisma.GlycemicCreateInput, 'value' | 'fasting'>,
  ): Promise<Response | ResponseError> {
    const user = request['user'];
    const userId = user?.userId;
    const dateNow = new Date();
    const fusoHorarioCorreto = 'America/Sao_Paulo';

    dateNow.toLocaleString('en-US', { timeZone: fusoHorarioCorreto });
    console.log(dateNow);
    const insert = await this.prisma.glycemic.create({
      data: {
        ...data,
        status: this.getStatusGlycemic(data.value, data.fasting),
        createdAt: dateNow,
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
    const where = {
      userId,
    };

    if (startDate && endDate) {
      where['createdAt'] = {
        gte: new Date(startDate).toISOString().split('T')[0] + 'T00:00:00.000Z',
        lte: new Date(endDate).toISOString().split('T')[0] + 'T23:59:59.000Z',
      };
    }
    const glycemic = await this.prisma.glycemic.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const mappedGlycemic = glycemic.map((glycemic) => ({
      ...glycemic,
      date: this.getDate(glycemic.createdAt),
      time: this.getTime(glycemic.createdAt),
    }));

    return {
      success: true,
      data: {
        glycemic: mappedGlycemic,
        average: this.getAverageGlycemic(glycemic),
        max: this.getMaxGlycemic(glycemic),
        min: this.getMinGlycemic(glycemic),
      },
    };
  }
}
