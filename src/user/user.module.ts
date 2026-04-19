import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HashModule } from '../hash/hash.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [HashModule],
  exports: [UserService], //-> So it's reusable in other module
})
export class UserModule {}
