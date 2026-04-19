import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashService } from '../hash/hash.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hash: HashService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;
    return this.prisma.user.create({
      data: { ...rest, passwordHash: await this.hash.hash(password) },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { password, ...rest } = updateUserDto;
    const data = password
      ? { ...rest, passwordHash: await this.hash.hash(password) }
      : rest;
    return this.prisma.user.update({ where: { id }, data });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
