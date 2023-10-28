import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { AuthGuard } from '@app/auth';
import { IUserRequest } from 'common/interfaces';
import { ConnectServiceDto } from './dto/connect.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @UseGuards(AuthGuard)
  @Post('connect')
  connectService(
    @Req() request: IUserRequest,
    @Body() body: ConnectServiceDto,
  ) {
    return this.servicesService.connectServiceOnUser(request, body.serviceId);
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
