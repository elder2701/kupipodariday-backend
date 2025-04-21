import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishesService } from './wishes.service';
import { Wish } from './entities/wish.entity';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createWish(
    @AuthUser() user: User,
    @Body() createWishDto: CreateWishDto,
  ) {
    return await this.wishesService.create(user.id, createWishDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteWish(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Wish> {
    return await this.wishesService.removeOne(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateWish(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    return await this.wishesService.updateOne(id, user.id, updateWishDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  async copyWishById(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Wish> {
    return await this.wishesService.copyWishById(id, user.id);
  }

  @Get('last')
  async getLastWishes(): Promise<Wish[]> {
    return await this.wishesService.findLastWishes();
  }

  @Get('top')
  async getTopWishes(): Promise<Wish[]> {
    return await this.wishesService.findTopWishes();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getWishById(@Param('id', ParseIntPipe) id: number): Promise<Wish> {
    const wish = await this.wishesService.findOne({ where: { id } });

    if (!wish) {
      throw new BadRequestException('Не такого желания');
    }

    return wish;
  }
}
