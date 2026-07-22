import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSaleDto: CreateSaleDto) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id: createSaleDto.customerId,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const cashier = await this.prisma.user.findUnique({
      where: {
        id: createSaleDto.cashierId,
      },
    });

    if (!cashier) {
      throw new NotFoundException('Cashier not found');
    }

    const count = await this.prisma.sale.count();

    const invoiceNo = `INV${String(count + 1).padStart(6, '0')}`;

    return this.prisma.sale.create({
      data: {
        invoiceNo,
        customerId: createSaleDto.customerId,
        cashierId: createSaleDto.cashierId,
        subtotal: 0,
        discount: 0,
        grandTotal: 0,
        status: 'DRAFT',
      },
    });
  }

  findAll() {
    return `This action returns all sales`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sale`;
  }

  update(id: number, updateSaleDto: UpdateSaleDto) {
    return `This action updates a #${id} sale`;
  }

  remove(id: number) {
    return `This action removes a #${id} sale`;
  }
}
