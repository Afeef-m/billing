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

  async findAll(
    page: number = 1,
    limit: number = 20,
    sort: string = 'name-asc',
  ) {
    const skip = (page - 1) * limit;

    let orderBy: any;

    switch (sort) {
      case 'name-asc':
        orderBy = { name: 'asc' };
        break;

      case 'name-desc':
        orderBy = { name: 'desc' };
        break;

      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;

      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;

      default:
        orderBy = { name: 'asc' };
    }

    const where = {
      isActive: true,
    };

    const [data, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),

      this.prisma.category.count({
        where,
      }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
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

    if (updateCategoryDto.name) {
      const existingCategory = await this.prisma.category.findFirst({
        where: {
          name: updateCategoryDto.name,
          NOT: {
            id,
          },
        },
      });

      if (existingCategory) {
        throw new ConflictException('Category already exists');
      }
    }

    return this.prisma.category.update({
      where: {
        id,
      },
      data: updateCategoryDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const productCount = await this.prisma.product.count({
      where: {
        categoryId: id,
      },
    });

    if (productCount > 0) {
      throw new ConflictException(
        'Cannot deactivate category because products are using it.',
      );
    }

    return this.prisma.category.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  }

  async restore(id: number) {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.isActive) {
      throw new ConflictException('Category is already active');
    }

    return this.prisma.category.update({
      where: {
        id,
      },
      data: {
        isActive: true,
      },
    });
  }

  async findInactive(
    page: number = 1,
    limit: number = 20,
    sort: string = 'name-asc',
  ) {
    const skip = (page - 1) * limit;

    let orderBy: any;

    switch (sort) {
      case 'name-asc':
        orderBy = { name: 'asc' };
        break;

      case 'name-desc':
        orderBy = { name: 'desc' };
        break;

      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;

      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;

      default:
        orderBy = { name: 'asc' };
    }

    const where = {
      isActive: false,
    };

    const [data, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),

      this.prisma.category.count({
        where,
      }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  async search(
    query: string,
    status: string = 'active',
    page: number = 1,
    limit: number = 20,
    sort: string = 'name-asc',
  ) {
    const skip = (page - 1) * limit;

    let orderBy: any;

    switch (sort) {
      case 'name-asc':
        orderBy = { name: 'asc' };
        break;

      case 'name-desc':
        orderBy = { name: 'desc' };
        break;

      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;

      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;

      default:
        orderBy = { name: 'asc' };
    }

    const where = {
      isActive: status !== 'inactive',
      OR: [
        {
          name: {
            contains: query,
            mode: 'insensitive' as const,
          },
        },
        {
          description: {
            contains: query,
            mode: 'insensitive' as const,
          },
        },
      ],
    };

    const [data, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),

      this.prisma.category.count({
        where,
      }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
