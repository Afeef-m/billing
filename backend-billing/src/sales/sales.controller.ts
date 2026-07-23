import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { AddSaleItemDto } from './dto/add-sale-item.dto';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleItemDto } from './dto/update-sale-item.dto';
import { UpdateSaleItemPriceDto } from './dto/update-sale-item-price.dto';
import { UpdateSaleDiscountDto } from './dto/update-sale-discount.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Post(':saleId/items')
  addItem(
    @Param('saleId') saleId: string,
    @Body() addSaleItemDto: AddSaleItemDto,
  ) {
    return this.salesService.addItem(+saleId, addSaleItemDto);
  }

  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @Patch('items/:itemId')
  updateItem(
    @Param('itemId') itemId: string,
    @Body() updateSaleItemDto: UpdateSaleItemDto,
  ) {
    return this.salesService.updateItem(+itemId, updateSaleItemDto);
  }

  @Patch('items/:itemId/price')
  updateItemPrice(
    @Param('itemId') itemId: string,
    @Body() dto: UpdateSaleItemPriceDto,
  ) {
    return this.salesService.updateItemPrice(+itemId, dto);
  }

  @Patch(':saleId/discount')
  updateDiscount(
    @Param('saleId') saleId: string,
    @Body() dto: UpdateSaleDiscountDto,
  ) {
    return this.salesService.updateDiscount(+saleId, dto);
  }

  @Delete('items/:itemId')
  removeItem(@Param('itemId') itemId: string) {
    return this.salesService.removeItem(+itemId);
  }

  @Post(':saleId/payment')
  createPayment(
    @Param('saleId') saleId: string,
    @Body() dto: CreatePaymentDto,
  ) {
    return this.salesService.createPayment(+saleId, dto);
  }

  @Patch(':saleId/complete')
  completeSale(@Param('saleId') saleId: string) {
    return this.salesService.completeSale(+saleId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
  //   return this.salesService.update(+id, updateSaleDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.salesService.remove(+id);
  // }
}
