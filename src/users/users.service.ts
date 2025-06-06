import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword } from 'src/hash.utils';

export enum AccountProvider {
  CREDENTIALS = 'credentials',
  GOOGLE = 'google',
}
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Criação com email e senha
  async createWithCredentials({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    // Verifica se já existe conta credentials com email
    const existing = await this.accountExists(
      AccountProvider.CREDENTIALS,
      email,
    );

    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await hashPassword(password);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        accounts: {
          create: {
            provider: 'credentials',
            providerAccountId: email,
            passwordHash: hashedPassword,
          },
        },
      },
    });

    return user;
  }

  // Criação com login Google (ou outro OAuth)
  async createWith({
    name,
    email,
    image,
    providerAccountId,
  }: {
    name?: string;
    email?: string;
    image?: string;
    providerAccountId: string; // Google sub id
  }) {
    // Verifica se já existe conta google com providerAccountId
    const existing = await this.accountExists(
      AccountProvider.GOOGLE,
      providerAccountId,
    );

    if (existing) {
      throw new ConflictException('User already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        image,
        accounts: {
          create: {
            provider: 'google',
            providerAccountId,
          },
        },
      },
    });

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        accounts: {
          some: {
            provider: 'credentials',
            providerAccountId: email,
          },
        },
      },
      include: {
        accounts: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async accountExists(
    provider: string,
    providerAccountId: string,
  ): Promise<boolean> {
    const account = await this.prisma.account.findFirst({
      where: {
        provider,
        providerAccountId,
      },
    });
    return account !== null;
  }
}
