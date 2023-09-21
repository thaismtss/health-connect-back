import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { AuthGuard } from '@app/auth';
import { IUserRequest } from 'common/interfaces';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @UseGuards(AuthGuard)
  @Post('connect')
  connectService(
    @Req() request: IUserRequest,
    @Query('serviceId') serviceId: string,
  ) {
    return this.servicesService.connectServiceOnUser(request, serviceId);
  }

  @UseGuards(AuthGuard)
  @Get('list')
  listServices() {
    return this.servicesService.listServices();
  }

  @UseGuards(AuthGuard)
  @Get('list/user')
  listServicesByUser(@Req() request: IUserRequest) {
    return this.servicesService.listServicesByUser(request);
  }
}
