import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ResponseLogin } from '../../../../common/interfaces';
import { UserService } from '../core/user/user.service';
import { AuthService } from '@app/auth';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async validateUser(email: string, password: string): Promise<ResponseLogin> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User or Password Invalid');
    }

    const valid = await this.userService.compareHash(password, user.password);
    if (valid) {
      const token = await this.authService.generateToken(user);

      return {
        success: true,
        data: {
          accessToken: token.accessToken,
          name: user.name || '',
        },
      };
    }
    throw new UnauthorizedException('User or Password Invalid');
  }
}
