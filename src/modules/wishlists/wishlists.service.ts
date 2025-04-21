import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, In, Repository } from 'typeorm';
import { WishList } from './entities/wish-list.entity';
import { User } from '../users/entities/user.entity';
import { CreateWishListDto } from './dto/create-wish-list.dto';
import { Wish } from '../wishes/entities/wish.entity';
import { UpdateWishListDto } from './dto/update-wish-list.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(WishList)
    private wishListRepository: Repository<WishList>,
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  async create(
    user: User,
    createWishListDto: CreateWishListDto,
  ): Promise<WishList> {
    const wishes = await this.wishesRepository.findBy({
      id: In(createWishListDto.itemsId),
      owner: {
        id: user.id,
      },
    });
    if (wishes.length !== createWishListDto.itemsId.length) {
      throw new BadRequestException('Один или несколько подарков не найдены');
    }

    const wishlist = this.wishListRepository.create({
      ...createWishListDto,
      owner: { id: user.id },
      items: wishes,
    });

    return await this.wishListRepository.save(wishlist);
  }

  async findOne(query: FindOneOptions<WishList>): Promise<WishList> {
    return await this.wishListRepository.findOne({
      relations: ['owner', 'items'],
      ...query,
    });
  }

  async findMany(query: FindManyOptions<WishList> = {}): Promise<WishList[]> {
    return await this.wishListRepository.find({
      relations: ['owner', 'items'],
      ...query,
    });
  }

  async updateOne(
    wishListId: number,
    user: User,
    updateWishListDto: UpdateWishListDto,
  ): Promise<WishList> {
    const wishList = await this.findOne({
      where: { id: wishListId, owner: { id: user.id } },
    });

    if (!wishList) {
      throw new BadRequestException('Такого списка желаний не существует');
    }

    if (updateWishListDto?.itemsId) {
      wishList.items = await this.wishesRepository.findBy({
        id: In(updateWishListDto.itemsId),
      });
    }

    const newWishList = this.wishListRepository.create({
      ...wishList,
      ...updateWishListDto,
    });

    return await this.wishListRepository.save(newWishList);
  }

  async removeOne(wishListId: number, user: User) {
    const wishList = this.findOne({
      where: { id: wishListId, owner: { id: user.id } },
    });

    if (!wishList) {
      throw new BadRequestException('Не возможно удалить список желаний');
    }

    return await this.wishListRepository.delete({
      id: wishListId,
    });
  }
}
