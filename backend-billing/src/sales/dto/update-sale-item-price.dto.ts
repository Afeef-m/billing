import { IsNumber, Min } from 'class-validator';

export class UpdateSaleItemPriceDto {
  @IsNumber()
  @Min(0)
  unitPrice!: number;
}
