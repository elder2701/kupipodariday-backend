import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';

@Controller()
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(@AuthUser() user: User) {
    return await this.authService.auth(user);
  }

  @Post('signup')
  async signUp(@Body() signUpUserDto: CreateUserDto) {
    return await this.usersService.create(signUpUserDto);
  }
}
