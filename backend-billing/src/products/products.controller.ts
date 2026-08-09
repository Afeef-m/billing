import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('sort') sort = 'name-asc',
  ) {
    return this.productsService.findAll(Number(page), Number(limit), sort);
  }

  @Get('inactive')
  findInactive(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('sort') sort = 'name-asc',
  ) {
    return this.productsService.findInactive(Number(page), Number(limit), sort);
  }

  @Get('search')
  search(
    @Query('query') query: string,
    @Query('status') status: 'active' | 'inactive' = 'active',
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('sort') sort = 'name-asc',
  ) {
    return this.productsService.search(
      query,
      status === 'active',
      Number(page),
      Number(limit),
      sort,
    );
  }

  @Get('generate-barcode')
  generateBarcode() {
    return this.productsService.generateBarcode();
  }
  @Get('barcode/:barcode')
  findByBarcode(@Param('barcode') barcode: string) {
    return this.productsService.findByBarcode(barcode);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.productsService.restore(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
