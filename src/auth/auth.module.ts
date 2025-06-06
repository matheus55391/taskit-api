import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // módulo dos usuários
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule, // importando UsersService
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecretKey', // usar variável de ambiente
      signOptions: { expiresIn: '1h' }, // tempo de expiração do token
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
