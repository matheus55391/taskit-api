import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountProvider, UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';

const prismaMock = {
  account: { findFirst: jest.fn() },
  user: { create: jest.fn(), findUnique: jest.fn() },
};

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createWithCredentials', () => {
    it('should throw ConflictException if account exists', async () => {
      prismaMock.account.findFirst.mockResolvedValue({ id: 'account1' });

      await expect(
        usersService.createWithCredentials({
          name: 'Test User',
          email: 'test@example.com',
          password: '123456',
        }),
      ).rejects.toThrow(ConflictException);

      expect(prismaMock.account.findFirst).toHaveBeenCalledWith({
        where: {
          provider: AccountProvider.CREDENTIALS,
          providerAccountId: 'test@example.com',
        },
      });
    });

    it('should create user if account does not exist', async () => {
      prismaMock.account.findFirst.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue({
        id: 'user1',
        name: 'Test User',
        email: 'test@example.com',
        accounts: [],
      });

      const result = await usersService.createWithCredentials({
        name: 'Test User',
        email: 'test@example.com',
        password: '123456',
      });

      expect(prismaMock.user.create).toHaveBeenCalled();
      expect(result).toMatchObject({ id: 'user1', name: 'Test User' });
    });
  });

  describe('createWith', () => {
    it('should throw ConflictException if google account exists', async () => {
      prismaMock.account.findFirst.mockResolvedValue({ id: 'account-google1' });

      await expect(
        usersService.createWith({
          name: 'Google User',
          email: 'google@example.com',
          image: 'image_url',
          providerAccountId: 'google-sub-123',
        }),
      ).rejects.toThrow(ConflictException);

      expect(prismaMock.account.findFirst).toHaveBeenCalledWith({
        where: {
          provider: AccountProvider.GOOGLE,
          providerAccountId: 'google-sub-123',
        },
      });
    });

    it('should create user with google account if not exists', async () => {
      prismaMock.account.findFirst.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue({
        id: 'user2',
        name: 'Google User',
        email: 'google@example.com',
        image: 'image_url',
        accounts: [],
      });

      const result = await usersService.createWith({
        name: 'Google User',
        email: 'google@example.com',
        image: 'image_url',
        providerAccountId: 'google-sub-123',
      });

      expect(prismaMock.user.create).toHaveBeenCalled();
      expect(result).toMatchObject({ id: 'user2', name: 'Google User' });
    });
  });

  describe('accountExists', () => {
    it('should return true if account exists', async () => {
      prismaMock.account.findFirst.mockResolvedValue({ id: 'account-exists' });

      const exists = await usersService.accountExists(
        AccountProvider.CREDENTIALS,
        'exists@example.com',
      );

      expect(exists).toBe(true);
    });

    it('should return false if account does not exist', async () => {
      prismaMock.account.findFirst.mockResolvedValue(null);

      const exists = await usersService.accountExists(
        AccountProvider.GOOGLE,
        'nonexistent-sub',
      );

      expect(exists).toBe(false);
    });
  });

  describe('findByEmail', () => {
    it('should return user if found', async () => {
      prismaMock.account.findFirst.mockResolvedValue({
        id: 'account1',
        user: { id: 'user1', name: 'Test User', email: 'test@example.com' },
      });

      const user = await usersService.findByEmail('test@example.com');

      expect(user).toMatchObject({ id: 'user1', name: 'Test User' });
    });

    it('should throw NotFoundException if no user found', async () => {
      prismaMock.account.findFirst.mockResolvedValue(null);

      await expect(
        usersService.findByEmail('notfound@example.com'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findById', () => {
    it('should return user if found', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user1',
        name: 'Test User',
        email: 'test@example.com',
      });

      const user = await usersService.findById('user1');

      expect(user).toMatchObject({ id: 'user1', name: 'Test User' });
    });

    it('should throw NotFoundException if user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(usersService.findById('no-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
