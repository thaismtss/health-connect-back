import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { GlycemicControlService } from './glycemic-control.service';
import {
  InsertGlucoseDto,
  insertGlucoseDtoSchema,
} from './dto/insert-glucose.dto';
import { ZodValidationPipe } from 'common/validation.pipe';
import { AuthGuard } from '@app/auth';
import { IUserRequest } from 'common/interfaces';

@Controller()
export class GlycemicControlController {
  constructor(
    private readonly glycemicControlService: GlycemicControlService,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  getGlycemicControl(
    @Req() request: IUserRequest,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.glycemicControlService.getGlycemicControl(
      request,
      startDate,
      endDate,
    );
  }

  @UseGuards(AuthGuard)
  @Post()
  @UsePipes(new ZodValidationPipe(insertGlucoseDtoSchema))
  insertGlycemicControl(
    @Body() data: InsertGlucoseDto,
    @Req() request: IUserRequest,
  ) {
    return this.glycemicControlService.insertGlucoseControl(request, {
      value: data.value,
      fasting: data.fasting,
    });
  }
}
