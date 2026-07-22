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
    // Check duplicate barcode
    if (createProductDto.barcode) {
      const existingProduct = await this.prisma.product.findUnique({
        where: {
          barcode: createProductDto.barcode,
        },
      });

      if (existingProduct) {
        throw new ConflictException('Barcode already exists');
      }
    }

    // Check category exists
    const category = await this.prisma.category.findUnique({
      where: {
        id: createProductDto.categoryId,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Create product
    return this.prisma.product.create({
      data: {
        barcode: createProductDto.barcode,
        name: createProductDto.name,
        categoryId: createProductDto.categoryId,
        brand: createProductDto.brand,
        unit: createProductDto.unit,
        purchasePrice: createProductDto.purchasePrice,
        retailPrice: createProductDto.retailPrice,
        wholesalePrice: createProductDto.wholesalePrice,
        mrp: createProductDto.mrp,
        currentStock: createProductDto.currentStock,
        notes: createProductDto.notes,
        isActive: createProductDto.isActive ?? true,
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
      },
      include: {
        category: true,
      },
      orderBy: {
        name: 'asc',
      },
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

  async search(query: string) {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        name: 'asc',
      },
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
