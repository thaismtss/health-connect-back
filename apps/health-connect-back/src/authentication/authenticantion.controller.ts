import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authenticantion.service';
import { LoginDto } from './dto/login.dto';
import { ResponseLogin } from '../../../../common/interfaces';
@Controller()
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @Post('auth/login')
  async login(@Body() loginData: LoginDto): Promise<ResponseLogin> {
    return this.authService.validateUser(loginData.email, loginData.password);
  }
}
