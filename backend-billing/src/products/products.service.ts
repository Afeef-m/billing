import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createProductDto: CreateProductDto) {
    let barcode = createProductDto.barcode;

    if (!barcode) {
      const generated = await this.generateBarcode();
      barcode = generated.barcode;
    }
    const existingProduct = await this.prisma.product.findUnique({
      where: {
        barcode,
      },
    });

    if (existingProduct) {
      throw new ConflictException('Barcode already exists');
    }

    if (createProductDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: {
          id: createProductDto.categoryId,
        },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    return this.prisma.product.create({
      data: {
        barcode,
        name: createProductDto.name,
        categoryId: createProductDto.categoryId,
        brand: createProductDto.brand,
        unit: createProductDto.unit,
        retailPrice: createProductDto.retailPrice,
        wholesalePrice: createProductDto.wholesalePrice,
        mrp: createProductDto.mrp,
        currentStock: createProductDto.currentStock ?? 0,
        notes: createProductDto.notes,
        isActive: createProductDto.isActive ?? true,
      },
    });
  }

  async findAll(sort: string = 'name-asc') {
    let orderBy: any = {
      name: 'asc',
    };

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

      case 'price-asc':
        orderBy = { retailPrice: 'asc' };
        break;

      case 'price-desc':
        orderBy = { retailPrice: 'desc' };
        break;

      default:
        orderBy = { name: 'asc' };
    }

    return this.prisma.product.findMany({
      where: {
        isActive: true,
      },
      include: {
        category: true,
      },
      orderBy,
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    if (updateProductDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: {
          id: updateProductDto.categoryId,
        },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    if (updateProductDto.barcode) {
      const existingProduct = await this.prisma.product.findFirst({
        where: {
          barcode: updateProductDto.barcode,
          NOT: {
            id,
          },
        },
      });

      if (existingProduct) {
        throw new ConflictException('Barcode already exists');
      }
    }

    return this.prisma.product.update({
      where: {
        id,
      },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  }

  async restore(id: number) {
    console.log('RESTORE CALLED:', id);

    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.isActive) {
      console.log('ALREADY ACTIVE!');
      throw new ConflictException('Product is already active');
    }

    const restoredProduct = await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        isActive: true,
      },
      include: {
        category: true,
      },
    });
    return restoredProduct;
  }

  async findInactive(sort: string = 'name-asc') {
    let orderBy: any = {
      name: 'asc',
    };

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

      case 'price-asc':
        orderBy = { retailPrice: 'asc' };
        break;

      case 'price-desc':
        orderBy = { retailPrice: 'desc' };
        break;
    }

    return this.prisma.product.findMany({
      where: {
        isActive: false,
      },
      include: {
        category: true,
      },
      orderBy,
    });
  }

  async findByBarcode(barcode: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        barcode,
        isActive: true,
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async search(query: string, isActive: boolean = true, sort = 'name-asc') {
    let orderBy: any = {
      name: 'asc',
    };

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

      case 'price-asc':
        orderBy = { retailPrice: 'asc' };
        break;

      case 'price-desc':
        orderBy = { retailPrice: 'desc' };
        break;
    }

    return this.prisma.product.findMany({
      where: {
        isActive,

        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            barcode: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            brand: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },

      include: {
        category: true,
      },

      orderBy,

      take: 20,
    });
  }
  async generateBarcode() {
    const latestProduct = await this.prisma.product.findFirst({
      where: {
        barcode: {
          startsWith: 'P',
        },
      },
      orderBy: {
        barcode: 'desc',
      },
    });

    if (!latestProduct?.barcode) {
      return {
        barcode: 'P000001',
      };
    }

    const currentNumber = Number(latestProduct.barcode.substring(1));

    return {
      barcode: `P${String(currentNumber + 1).padStart(6, '0')}`,
    };
  }
}
