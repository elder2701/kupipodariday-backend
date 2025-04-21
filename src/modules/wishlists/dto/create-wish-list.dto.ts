import { IsNumber } from 'class-validator';
import { PickType } from '@nestjs/mapped-types';
import { WishList } from '../entities/wish-list.entity';

export class CreateWishListDto extends PickType(WishList, [
  'name',
  'image',
  'description',
]) {
  @IsNumber({}, { each: true })
  itemsId: number[];
}
