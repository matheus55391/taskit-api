import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { AccountProvider } from 'src/users/users.service';

export class OAuthLoginDto {
  @ApiProperty({ example: AccountProvider.GOOGLE, enum: AccountProvider })
  @IsEnum(AccountProvider)
  provider: AccountProvider;

  @ApiProperty({ example: 'google-oauth-sub-1234567890' })
  @IsString()
  providerAccountId: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'john@gmail.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
  @IsOptional()
  @IsString()
  image?: string;
}
