import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/core/user/user.service';
import { User } from '@prisma/client';
import { ResponseLogin } from 'src/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<ResponseLogin> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User or Password Invalid');
    }

    const valid = await this.userService.compareHash(password, user.password);
    if (valid) {
      const token = await this.generateToken(user);

      return {
        success: true,
        data: token,
      };
    }
    throw new UnauthorizedException('User or Password Invalid');
  }

  async generateToken(payload: User) {
    return {
      accessToken: this.jwtService.sign(
        { email: payload.email },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '24h',
        },
      ),
    };
  }
}
