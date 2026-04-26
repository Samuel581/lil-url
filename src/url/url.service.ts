import { Injectable } from '@nestjs/common';
import { ShortLink } from './interfaces/url.interfaces';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { nanoid } from 'nanoid';

@Injectable()
export class UrlService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async shortenUrl(
    userId: string,
    originalUrl: string,
    customAlias?: string,
  ): Promise<ShortLink> {
    const shortCode = customAlias || this.generateNanoId();
    const codeAlreadyExists = await this.prisma.link.findUnique({
      where: { shortCode },
    });

    if (codeAlreadyExists) {
      throw new Error('Custom alias already in use');
    }

    const shortLink = await this.prisma.link.create({
      data: { originalUrl, shortCode, userId },
    });

    return {
      shortCode: shortLink.shortCode || ' ',
      originalUrl: shortLink.originalUrl,
    };
  }

  private generateNanoId() {
    return nanoid(7);
  }
}
