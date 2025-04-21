import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { verifyHash } from '../../common/helpers/hash';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne({
      select: { username: true, password: true, id: true, email: true },
      where: { username },
    });

    if (user && (await verifyHash(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async auth(user: User) {
    return { access_token: await this.jwtService.signAsync(user) };
  }
}
