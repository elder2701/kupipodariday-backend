import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../modules/users/entities/user.entity';

export const AuthUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();

    return request.user as User;
  },
);
