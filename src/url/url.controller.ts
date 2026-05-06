import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Param,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { CreateShortLinkDto } from './dto/create-short-link.dto';
import { ShortLink } from './interfaces/url.interfaces';
import { UrlService } from './url.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedUser } from 'src/auth/interfaces/auth.interfaces';
import type { Response } from 'express';

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

  @Get(':id')
  async redirectUrl(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<void> {
    const link = await this.urlService.findLongUrl(id);
    if (link) {
      return response.status(HttpStatus.FOUND).redirect(link.originalUrl);
    } else {
      response.status(HttpStatus.NOT_FOUND).json({
        message: 'Link not valid',
      });
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getShortenedLinksByUser(
    @Request() request: { user: AuthenticatedUser },
  ): Promise<ShortLink[]> {
    return await this.urlService.getUserShortenedLinks(request.user.id);
  }
}
