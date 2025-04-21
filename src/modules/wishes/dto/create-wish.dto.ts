import { PickType } from '@nestjs/mapped-types';
import { Wish } from '../entities/wish.entity';
import { IsNumber, Min } from 'class-validator';

export class CreateWishDto extends PickType(Wish, [
  'name',
  'link',
  'image',
  'description',
]) {
  @IsNumber()
  @Min(0)
  price: number;
}
