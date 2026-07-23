import { IsNumber, Min } from 'class-validator';

export class UpdateSaleDiscountDto {
  @IsNumber()
  @Min(0)
  discount!: number;
}
