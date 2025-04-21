import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsBoolean, IsDecimal, Min } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Offer extends AbstractEntity {
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
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;

  @ManyToOne(() => User, (user) => user.offers, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  item: Wish;
}
