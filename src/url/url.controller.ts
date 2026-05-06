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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CreateShortLinkDto } from './dto/create-short-link.dto';
import { ShortLink } from './interfaces/url.interfaces';
import { UrlService } from './url.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedUser } from 'src/auth/interfaces/auth.interfaces';
import type { Response } from 'express';

@ApiTags('url')
@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Shorten a URL' })
  @ApiResponse({ status: 201, description: 'Short link created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiOperation({ summary: 'Redirect to the original URL' })
  @ApiParam({ name: 'id', description: 'Short code' })
  @ApiResponse({ status: 302, description: 'Redirects to the original URL' })
  @ApiResponse({ status: 404, description: 'Link not found or expired' })
  async redirectUrl(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    const link = await this.urlService.findLongUrl(id);
    if (link) {
      return res.status(HttpStatus.FOUND).redirect(link.originalUrl);
    } else {
      res.status(HttpStatus.NOT_FOUND).json({
        message: 'Link not valid',
      });
    }
  }
}
