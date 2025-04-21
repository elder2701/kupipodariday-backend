import { CreateWishListDto } from './create-wish-list.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateWishListDto extends PartialType(CreateWishListDto) {}
