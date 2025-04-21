import { PickType } from '@nestjs/mapped-types';
import { User } from '../../users/entities/user.entity';

export class SigninUserDto extends PickType(User, [
  'email',
  'password',
] as const) {}
