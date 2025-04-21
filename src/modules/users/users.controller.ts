import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FindUsersDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { WishesService } from '../wishes/wishes.service';
import { Wish } from '../wishes/entities/wish.entity';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUser(@AuthUser() user: User): Promise<User> {
    return await this.usersService.findOne({
      where: { id: user.id },
      select: {
        email: true,
        username: true,
        id: true,
        avatar: true,
        about: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateUser(
    @AuthUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.updateOne(user.id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/wishes')
  async getUserWishes(@AuthUser() user: User) {
    return await this.wishesService.findUserWishes(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  async getUserByUsername(@Param('username') username: string) {
    return await this.usersService.findOne({
      where: { username },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username/wishes')
  async getWishesByUsername(
    @Param('username') username: string,
  ): Promise<Wish[]> {
    return await this.wishesService.findWishesByUsername(username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('find')
  async findUserByQuery(@Body() findUsersDto: FindUsersDto): Promise<User[]> {
    return await this.usersService.findUserByNameOrEmail(findUsersDto);
  }
}
