import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountProvider, UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from 'src/hash.utils'; // seu util de comparar senha

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      const account = user.accounts.find(
        (account) =>
          account.provider === (AccountProvider.CREDENTIALS as string) &&
          account.providerAccountId === email,
      );
      if (!account || !account.passwordHash) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const passwordValid = await comparePassword(
        password,
        account.passwordHash,
      );

      if (!passwordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return user;
    } catch {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
