import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        username: createUserDto.username,
      },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    return this.prisma.user.create({
      data: {
        fullName: createUserDto.fullName,
        username: createUserDto.username,
        password: createUserDto.password,
        role: createUserDto.role ?? UserRole.CASHIER,
        isActive: createUserDto.isActive ?? true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        fullName: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  }
}
