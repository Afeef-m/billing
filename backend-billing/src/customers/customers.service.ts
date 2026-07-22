import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCustomerDto: CreateCustomerDto) {
    const existingCustomer = await this.prisma.customer.findUnique({
      where: {
        customerNo: createCustomerDto.customerNo,
      },
    });

    if (existingCustomer) {
      throw new ConflictException('Customer number already exists');
    }

    return this.prisma.customer.create({
      data: {
        customerNo: createCustomerDto.customerNo,
        name: createCustomerDto.name,
        phone: createCustomerDto.phone,
        alternatePhone: createCustomerDto.alternatePhone,
        address: createCustomerDto.address,
        openingBalance: createCustomerDto.openingBalance ?? 0,
        currentBalance: createCustomerDto.currentBalance ?? 0,
        isActive: createCustomerDto.isActive ?? true,
      },
    });
  }

  async findAll() {
    return this.prisma.customer.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    await this.findOne(id);

    return this.prisma.customer.update({
      where: {
        id,
      },
      data: updateCustomerDto,
    });
  }
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.customer.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  }
  async search(query: string) {
    return this.prisma.customer.findMany({
      where: {
        isActive: true,
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      orderBy: {
        name: 'asc',
      },
      take: 20,
    });
  }
  async findByPhone(phone: string) {
    const customer = await this.prisma.customer.findFirst({
      where: {
        phone,
        isActive: true,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }
  async getDefaultCustomer() {
    const customer = await this.prisma.customer.findFirst({
      where: {
        name: 'Walk-in Customer',
        isActive: true,
      },
    });

    if (!customer) {
      throw new NotFoundException('Default customer not found');
    }

    return customer;
  }
}
