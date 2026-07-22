import { IsInt } from 'class-validator';

export class CreateSaleDto {
  @IsInt()
  customerId!: number;

  @IsInt()
  cashierId!: number;
}
