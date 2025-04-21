import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { FindManyOptions, FindOneOptions, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { hashValue } from '../../common/helpers/hash';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password } = createUserDto;
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: await hashValue(password),
    });
    return await this.usersRepository.save(newUser);
  }

  async updateOne(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { password } = updateUserDto;

    const user = await this.findById(userId);
    if (password) {
      updateUserDto.password = await hashValue(password);
    }
    const newUser = this.usersRepository.create({
      ...user,
      ...updateUserDto,
    });

    return this.usersRepository.save(newUser);
  }

  async findById(id: number): Promise<User> {
    return await this.usersRepository.findOneBy({ id });
  }

  async findOne(query: FindOneOptions<User>): Promise<User | null> {
    return await this.usersRepository.findOne(query);
  }

  async findMany(query: FindManyOptions<User>): Promise<User[]> {
    return await this.usersRepository.find(query);
  }

  async findUserByNameOrEmail(findUsersDto: FindUsersDto): Promise<User[]> {
    return await this.findMany({
      where: [
        { username: ILike(`%${findUsersDto.query}%`) },
        { email: ILike(`%${findUsersDto.query}%`) },
      ],
      relations: ['wishes', 'wishlists', 'offers'],
    });
  }
}
