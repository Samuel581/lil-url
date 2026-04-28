import {
  IsISO8601,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
} from 'class-validator';

export class CreateShortLinkDto {
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
  })
  originalUrl: string;

  @IsOptional()
  @IsString()
  @Length(4, 32)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message:
      'customAlias can only contain letters, numbers, hyphens, and underscores',
  })
  customAlias?: string;

  @IsOptional()
  @IsISO8601()
  expiresAt?: string;
}
