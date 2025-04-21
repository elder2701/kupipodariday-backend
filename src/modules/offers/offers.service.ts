import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOneOptions, Not, Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    private readonly dataSource: DataSource,
  ) {}

  async create(user: User, createOfferDto: CreateOfferDto): Promise<Offer> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const actualUser = await queryRunner.manager.findOneOrFail(User, {
        where: { id: user.id },
      });

      const wish = await queryRunner.manager.findOneOrFail(Wish, {
        where: { id: createOfferDto.itemId, owner: Not(user.id) },
        relations: ['owner', 'offers'],
      });

      const total = wish.offers.reduce(
        (total, offer) => total + offer.amount,
        0,
      );
      const updatedTotal = total + createOfferDto.amount;

      if (updatedTotal > wish.price) {
        throw new BadRequestException('Сумма привышает сумму подарка');
      }

      wish.raised = updatedTotal;

      const offer = queryRunner.manager.create(Offer, {
        hidden: createOfferDto.hidden || false,
        user: actualUser,
        amount: createOfferDto.amount,
        item: wish,
      });

      await queryRunner.manager.save(wish);
      await queryRunner.manager.save(offer);
      await queryRunner.commitTransaction();

      return offer;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Offer[]> {
    return await this.offersRepository.find({
      relations: [
        'item',
        'user',
        'user.offers',
        'user.wishes',
        'user.wishlists',
        'user.wishlists.owner',
        'user.wishlists.items',
      ],
    });
  }

  async findOne(query: FindOneOptions<Offer>): Promise<Offer> {
    const offer = await this.offersRepository.findOne({
      relations: [
        'item',
        'user',
        'user.offers',
        'user.wishes',
        'user.wishlists',
        'user.wishlists.owner',
        'user.wishlists.items',
      ],
      ...query,
    });

    if (!offer) throw new BadRequestException('Предложение не найдено');

    return offer;
  }
}
