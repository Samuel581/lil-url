import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
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
    expiresAtRaw?: string,
  ): Promise<ShortLink> {
    const expiresAt = expiresAtRaw
      ? this.parseAndValidateExpiry(expiresAtRaw)
      : undefined;

    let shortCode: string;

    if (customAlias) {
      const exists = await this.prisma.link.findUnique({
        where: { shortCode: customAlias },
      });
      if (exists) throw new ConflictException('Custom alias already in use');
      shortCode = customAlias;
    } else {
      shortCode = await this.generateUniqueCode();
    }

    const shortLink = await this.prisma.link.create({
      data: { originalUrl, shortCode, userId, expiresAt },
    });

    const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000';

    return {
      shortUrl: `${baseUrl}/${shortLink.shortCode}`,
      shortCode: shortLink.shortCode,
      originalUrl: shortLink.originalUrl,
      expiresAt: shortLink.expiresAt ?? undefined,
    };
  }

  private parseAndValidateExpiry(raw: string): Date {
    const date = new Date(raw);
    const now = new Date();
    const oneYearFromNow = new Date(now);
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    if (date <= now)
      throw new BadRequestException('expiresAt must be a future date');
    if (date > oneYearFromNow)
      throw new BadRequestException(
        'expiresAt cannot be more than 1 year from now',
      );

    return date;
  }

  // Just a guard in case of repeated collisions, nanoid is very unlikely to generate duplicates with 8 characterss
  private async generateUniqueCode(): Promise<string> {
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = nanoid(8);
      const exists = await this.prisma.link.findUnique({
        where: { shortCode: code },
      });
      if (!exists) return code;
    }
    throw new ConflictException(
      'Failed to generate a unique short code, please try again',
    );
  }
}
