import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OffersService } from './offers.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('offers')
export class OffersController {
  constructor(private offersService: OffersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOffer(
    @AuthUser() user: User,
    @Body() createOfferDto: CreateOfferDto,
  ) {
    return await this.offersService.create(user, createOfferDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getOffers() {
    return await this.offersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOffer(@Param('id', ParseIntPipe) id: number) {
    return await this.offersService.findOne({ where: { id } });
  }
}
