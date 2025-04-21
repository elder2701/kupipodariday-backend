import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from '../users/entities/user.entity';

const LAST_WISHES = 40;
const TOP_WISHES = 20;

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(ownerId: number, createWishDto: CreateWishDto): Promise<Wish> {
    const user = await this.userRepository.findOneOrFail({
      where: { id: ownerId },
    });
    const newWish = this.wishRepository.create({
      ...createWishDto,
      owner: user,
    });

    return await this.wishRepository.save(newWish);
  }

  async updateOne(
    wishId: number,
    ownerId: number,
    updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    const wish = await this.findOne({
      where: { id: wishId, owner: { id: ownerId } },
    });

    if (updateWishDto?.price !== undefined && wish.offers.length > 0) {
      throw new BadRequestException(
        'Нельзя изменять стоимость, если уже есть желающие скинуться',
      );
    }

    if (!wish) {
      throw new ForbiddenException('Такого желания не существует');
    }

    return await this.wishRepository.save({ ...wish, ...updateWishDto });
  }

  async findOne(query: FindOneOptions<Wish>): Promise<Wish> {
    return await this.wishRepository.findOne({
      relations: ['owner', 'offers', 'offers.user'],
      ...query,
    });
  }

  async findMany(query: FindManyOptions<Wish>): Promise<Wish[]> {
    return await this.wishRepository.find({
      relations: ['owner', 'offers', 'offers.user'],
      ...query,
    });
  }

  async removeOne(wishId: number, ownerId: number): Promise<Wish> {
    const wish = await this.findOne({
      where: { id: wishId, owner: { id: ownerId } },
    });

    if (!wish) {
      throw new BadRequestException(
        'Желания не существует или его нельзя изменить',
      );
    }

    return await this.wishRepository.remove(wish);
  }

  async copyWishById(wishId: number, ownerId: number): Promise<Wish> {
    const wish = await this.findOne({
      where: { id: wishId },
    });

    if (wish.owner.id === ownerId) {
      throw new BadRequestException('Свое желание нельзя копировать');
    }

    if (!wish) {
      throw new BadRequestException(
        'Желания не существует или его нельзя изменить',
      );
    }

    const { id, ...copiedWish } = wish;

    const newWish = this.wishRepository.create({
      ...copiedWish,
      copied: ++wish.copied,
      raised: 0,
      owner: { id: ownerId },
    });

    return await this.wishRepository.save(newWish);
  }

  async findWishesByUsername(username: string): Promise<Wish[]> {
    return await this.findMany({
      where: {
        owner: { username },
      },
      relations: ['owner', 'offers'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findUserWishes(user: User) {
    return await this.findMany({
      where: {
        owner: {
          id: user.id,
        },
      },
      relations: ['owner', 'offers'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findTopWishes() {
    return await this.findMany({
      order: {
        copied: 'DESC',
      },
      take: TOP_WISHES,
    });
  }

  async findLastWishes(): Promise<Wish[]> {
    return await this.findMany({
      order: {
        createdAt: 'DESC',
      },
      take: LAST_WISHES,
    });
  }
}
