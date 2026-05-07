import { Module } from '@nestjs/common';
import { UrlController } from './url.controller';
import { RedirectController } from './redirect.controller';
import { UrlService } from './url.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';

@Module({
  controllers: [UrlController, RedirectController],
  providers: [UrlService],
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
})
export class UrlModule {}
