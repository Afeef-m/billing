import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
  const existingCategory = await this.prisma.category.findUnique({
    where: {
      name: createCategoryDto.name,
    },
  });

  if (existingCategory) {
    throw new ConflictException('Category already exists');
  }

  return this.prisma.category.create({
    data: {
      name: createCategoryDto.name,
      description: createCategoryDto.description,
    },
  });
}


  async findAll() {
  return this.prisma.category.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
}

  async findOne(id: number) {
  const category = await this.prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new NotFoundException('Category not found');
  }

  return category;
}

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
  await this.findOne(id);

  return this.prisma.category.update({
    where: {
      id,
    },
    data: updateCategoryDto,
  });
}

  async remove(id: number) {
  await this.findOne(id);

  return this.prisma.category.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  });
}
}
