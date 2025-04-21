import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import {
  IsDecimal,
  IsInt,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';

@Entity()
export class Wish extends AbstractEntity {
  @Column({ length: 250 })
  @IsString()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  @IsDecimal()
  @Min(0)
  price: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  @IsDecimal()
  @Min(0)
  raised: number;

  @Column({ length: 1024 })
  @IsString()
  @Length(1, 1024)
  description: string;

  @Column('int', { default: 0 })
  @IsInt()
  @Min(0)
  copied: number;

  @ManyToOne(() => User, (user) => user.wishes, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
}
