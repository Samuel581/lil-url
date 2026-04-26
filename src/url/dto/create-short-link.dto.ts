import { IsOptional, IsUrl } from 'class-validator';

export class CreateShortLinkDto {
  @IsUrl()
  originalUrl: string;

  @IsOptional()
  customAlias?: string;
}
