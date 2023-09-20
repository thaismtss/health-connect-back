import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ResponseLogin } from '../../../../common/interfaces';
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('auth/login')
  async login(@Body() loginData: LoginDto): Promise<ResponseLogin> {
    return this.authService.validateUser(loginData.email, loginData.password);
  }
}
