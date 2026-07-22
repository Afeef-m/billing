import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [PrismaModule, CategoriesModule, ProductsModule, CustomersModule],
})
export class AppModule {}
