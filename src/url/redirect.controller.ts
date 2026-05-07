import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { UrlService } from './url.service';

@Controller()
export class RedirectController {
  constructor(private readonly urlService: UrlService) {}

  @Get(':code')
  async redirectUrl(
    @Param('code') code: string,
    @Res() response: Response,
  ): Promise<void> {
    const link = await this.urlService.findLongUrl(code);
    if (link) {
      return response.status(HttpStatus.FOUND).redirect(link.originalUrl);
    } else {
      response.status(HttpStatus.NOT_FOUND).json({ message: 'Link not valid' });
    }
  }
}
