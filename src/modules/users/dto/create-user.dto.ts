import { PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

export class CreateUserDto extends PickType(User, [
  'username',
  'email',
  'password',
  'about',
  'avatar',
]) {}
