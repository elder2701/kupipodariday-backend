import {
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
import { CreateWishListDto } from './dto/create-wish-list.dto';
import { UpdateWishListDto } from './dto/update-wish-list.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { User } from '../users/entities/user.entity';
import { WishlistsService } from './wishlists.service';
import { WishList } from './entities/wish-list.entity';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishListService: WishlistsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getWishLists(): Promise<WishList[]> {
    return await this.wishListService.findMany();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createWishList(
    @AuthUser() user: User,
    @Body() createWishListDto: CreateWishListDto,
  ): Promise<WishList> {
    return await this.wishListService.create(user, createWishListDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserWishList(@Param('id', ParseIntPipe) id: number) {
    return await this.wishListService.findOne({ where: { id } });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateWishList(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishListDto: UpdateWishListDto,
  ) {
    return await this.wishListService.updateOne(id, user, updateWishListDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeWishList(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.wishListService.removeOne(id, user);
  }
}
