import {
  IsISO8601,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateShortLinkDto {
  @ApiProperty({ example: 'https://example.com/some/long/path' })
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
  })
  originalUrl: string;

  @ApiPropertyOptional({
    example: 'my-link',
    minLength: 4,
    maxLength: 32,
    description: 'Letters, numbers, hyphens, and underscores only',
  })
  @IsOptional()
  @IsString()
  @Length(4, 32)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message:
      'customAlias can only contain letters, numbers, hyphens, and underscores',
  })
  customAlias?: string;

  @ApiPropertyOptional({ example: '2026-12-31T23:59:59.000Z' })
  @IsOptional()
  @IsISO8601()
  expiresAt?: string;
}
