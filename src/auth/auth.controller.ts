import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dtos/login-dto';
import { RegisterDto } from './dtos/register-dto';
import { OAuthLoginDto } from './dtos/OAuth-login-dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 201, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    return this.authService.login(user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new user with email and password' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.usersService.createWithCredentials({
      name: registerDto.name,
      email: registerDto.email,
      password: registerDto.password,
    });
    return user;
  }

  @Post('oauth/login')
  @ApiOperation({ summary: 'Login or register user via OAuth provider' })
  @ApiBody({ type: OAuthLoginDto })
  async oauthLogin(@Body() oauthLoginDto: OAuthLoginDto) {
    const user = await this.authService.validateOAuthUser(
      oauthLoginDto.provider,
      oauthLoginDto.providerAccountId,
      {
        name: oauthLoginDto.name,
        email: oauthLoginDto.email,
        image: oauthLoginDto.image,
      },
    );

    return this.authService.login(user);
  }
}
