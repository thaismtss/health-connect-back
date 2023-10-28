import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto, RegisterUserSchema } from './dto/register-user.dto';
import { ZodValidationPipe } from 'common/validation.pipe';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(RegisterUserSchema))
  async signupUser(
    @Body() userData: RegisterUserDto,
  ): Promise<{ success: boolean }> {
    return this.userService.registerUser(userData);
  }
}
