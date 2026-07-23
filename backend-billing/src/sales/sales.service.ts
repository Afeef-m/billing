import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Prisma, SaleStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { AddSaleItemDto } from './dto/add-sale-item.dto';
import { calculateSaleTotals } from './helpers/sale-total.helper';
import { UpdateSaleItemDto } from './dto/update-sale-item.dto';
import { UpdateSaleItemPriceDto } from './dto/update-sale-item-price.dto';
import { UpdateSaleDiscountDto } from './dto/update-sale-discount.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';

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

  async findAll() {
    return this.prisma.sale.findMany({
      include: {
        items: true,
        customer: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: {
        customer: true,
        payment: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    return sale;
  }

  // update(id: number, updateSaleDto: UpdateSaleDto) {
  //   return `This action updates a #${id} sale`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} sale`;
  // }

  async addItem(saleId: number, addSaleItemDto: AddSaleItemDto) {
    // 1. Find sale
    const sale = await this.prisma.sale.findUnique({
      where: { id: saleId },
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    // 2. Find product by barcode
    const product = await this.prisma.product.findFirst({
      where: {
        barcode: addSaleItemDto.barcode,
        isActive: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const existingItem = await this.prisma.saleItem.findFirst({
      where: {
        saleId,
        productId: product.id,
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + addSaleItemDto.quantity;

      await this.prisma.saleItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: newQuantity,
          total: existingItem.unitPrice.mul(newQuantity),
        },
      });
    } else {
      await this.prisma.saleItem.create({
        data: {
          saleId,
          productId: product.id,
          quantity: addSaleItemDto.quantity,
          unitPrice: product.retailPrice,
          discount: new Prisma.Decimal(0),
          total: product.retailPrice.mul(addSaleItemDto.quantity),
        },
      });
    }

    // 5. Read all sale items
    const items = await this.prisma.saleItem.findMany({
      where: {
        saleId,
      },
      select: {
        total: true,
      },
    });

    // 6. Calculate totals
    const totals = calculateSaleTotals(items, sale.discount);

    // 7. Update sale
    await this.prisma.sale.update({
      where: {
        id: saleId,
      },
      data: {
        subtotal: totals.subtotal,
        grandTotal: totals.grandTotal,
      },
    });

    // 8. Return updated sale
    return this.prisma.sale.findUnique({
      where: {
        id: saleId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    });
  }
  async updateItem(itemId: number, dto: UpdateSaleItemDto) {
    // 1. Find SaleItem
    const saleItem = await this.prisma.saleItem.findUnique({
      where: {
        id: itemId,
      },
    });

    if (!saleItem) {
      throw new NotFoundException('Sale item not found');
    }

    // 2. Calculate new total
    const total = saleItem.unitPrice.mul(dto.quantity);

    // 3. Update SaleItem
    await this.prisma.saleItem.update({
      where: {
        id: itemId,
      },
      data: {
        quantity: dto.quantity,
        total,
      },
    });

    // 4. Find Sale
    const sale = await this.prisma.sale.findUnique({
      where: {
        id: saleItem.saleId,
      },
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    // 5. Read all items
    const items = await this.prisma.saleItem.findMany({
      where: {
        saleId: sale.id,
      },
      select: {
        total: true,
      },
    });

    // 6. Calculate bill totals
    const totals = calculateSaleTotals(items, sale.discount);

    // 7. Update Sale
    await this.prisma.sale.update({
      where: {
        id: sale.id,
      },
      data: {
        subtotal: totals.subtotal,
        grandTotal: totals.grandTotal,
      },
    });

    // 8. Return updated bill
    return this.prisma.sale.findUnique({
      where: {
        id: sale.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    });
  }

  async removeItem(itemId: number) {
    const saleItem = await this.prisma.saleItem.findUnique({
      where: {
        id: itemId,
      },
    });

    if (!saleItem) {
      throw new NotFoundException('Sale item not found');
    }

    await this.prisma.saleItem.delete({
      where: {
        id: itemId,
      },
    });

    const sale = await this.prisma.sale.findUnique({
      where: {
        id: saleItem.saleId,
      },
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    const items = await this.prisma.saleItem.findMany({
      where: {
        saleId: sale.id,
      },
      select: {
        total: true,
      },
    });

    const totals = calculateSaleTotals(items, sale.discount);

    await this.prisma.sale.update({
      where: {
        id: sale.id,
      },
      data: {
        subtotal: totals.subtotal,
        grandTotal: totals.grandTotal,
      },
    });

    return this.prisma.sale.findUnique({
      where: {
        id: sale.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    });
  }
  async updateItemPrice(itemId: number, dto: UpdateSaleItemPriceDto) {
    const saleItem = await this.prisma.saleItem.findUnique({
      where: {
        id: itemId,
      },
    });

    if (!saleItem) {
      throw new NotFoundException('Sale item not found');
    }

    const total = new Prisma.Decimal(dto.unitPrice).mul(saleItem.quantity);

    await this.prisma.saleItem.update({
      where: {
        id: itemId,
      },
      data: {
        unitPrice: dto.unitPrice,
        total,
      },
    });

    const sale = await this.prisma.sale.findUnique({
      where: {
        id: saleItem.saleId,
      },
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    const items = await this.prisma.saleItem.findMany({
      where: {
        saleId: sale.id,
      },
      select: {
        total: true,
      },
    });

    const totals = calculateSaleTotals(items, sale.discount);

    await this.prisma.sale.update({
      where: {
        id: sale.id,
      },
      data: {
        subtotal: totals.subtotal,
        grandTotal: totals.grandTotal,
      },
    });

    return this.prisma.sale.findUnique({
      where: {
        id: sale.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    });
  }
  async updateDiscount(saleId: number, dto: UpdateSaleDiscountDto) {
    const sale = await this.prisma.sale.findUnique({
      where: {
        id: saleId,
      },
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    const items = await this.prisma.saleItem.findMany({
      where: {
        saleId,
      },
      select: {
        total: true,
      },
    });

    const totals = calculateSaleTotals(items, new Prisma.Decimal(dto.discount));

    await this.prisma.sale.update({
      where: {
        id: saleId,
      },
      data: {
        discount: dto.discount,
        subtotal: totals.subtotal,
        grandTotal: totals.grandTotal,
      },
    });

    return this.prisma.sale.findUnique({
      where: {
        id: saleId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    });
  }
  async createPayment(saleId: number, dto: CreatePaymentDto) {
    // 1. Find Sale
    const sale = await this.prisma.sale.findUnique({
      where: {
        id: saleId,
      },
      include: {
        payment: true,
      },
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    // 2. Only draft sales can receive payment
    if (sale.status !== 'DRAFT') {
      throw new BadRequestException('Sale is already completed');
    }

    // 3. Prevent duplicate payment
    if (sale.payment) {
      throw new ConflictException('Payment already exists');
    }

    // 4. Calculate change
    const received = new Prisma.Decimal(dto.receivedAmount);

    if (received.lessThan(sale.grandTotal)) {
      throw new BadRequestException('Received amount is less than bill total');
    }

    const change = received.minus(sale.grandTotal);

    // 5. Save payment
    const payment = await this.prisma.payment.create({
      data: {
        saleId,
        method: dto.method,
        receivedAmount: received,
        paidAmount: sale.grandTotal,
        changeAmount: change,
      },
    });

    return payment;
  }
  async completeSale(saleId: number) {
    // 1. Find Sale
    const sale = await this.prisma.sale.findUnique({
      where: {
        id: saleId,
      },
      include: {
        payment: true,
        items: true,
      },
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    // 2. Only DRAFT sales can be completed
    if (sale.status !== SaleStatus.DRAFT) {
      throw new BadRequestException('Sale is already completed');
    }

    // 3. Payment must exist
    if (!sale.payment) {
      throw new BadRequestException('Payment not found');
    }

    // 4. Reduce stock
    for (const item of sale.items) {
      await this.prisma.product.update({
        where: {
          id: item.productId,
        },
        data: {
          currentStock: {
            decrement: item.quantity,
          },
        },
      });
    }

    // 5. Mark sale as completed
    await this.prisma.sale.update({
      where: {
        id: saleId,
      },
      data: {
        status: SaleStatus.COMPLETED,
      },
    });

    // 6. Return completed invoice
    return this.prisma.sale.findUnique({
      where: {
        id: saleId,
      },
      include: {
        customer: true,
        payment: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}
