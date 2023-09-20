import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateToken(payload: User) {
    return {
      accessToken: this.jwtService.sign(
        { email: payload.email, userId: payload.id },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '24h',
        },
      ),
    };
  }
}
