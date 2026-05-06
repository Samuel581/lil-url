import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateShortLinkDto } from './dto/create-short-link.dto';
import { ShortLink } from './interfaces/url.interfaces';
import { UrlService } from './url.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedUser } from 'src/auth/interfaces/auth.interfaces';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  @UseGuards(JwtAuthGuard)
  async shortenUrl(
    @Body() body: CreateShortLinkDto,
    @Request() req: { user: AuthenticatedUser },
  ): Promise<ShortLink> {
    return this.urlService.shortenUrl(
      req.user.id,
      body.originalUrl,
      body.customAlias,
      body.expiresAt,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getShortenedLinksByUser(
    @Request() request: { user: AuthenticatedUser },
  ): Promise<ShortLink[]> {
    return await this.urlService.getUserShortenedLinks(request.user.id);
  }
}
