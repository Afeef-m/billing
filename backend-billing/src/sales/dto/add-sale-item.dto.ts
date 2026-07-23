import { IsInt, IsString, Min } from 'class-validator';

export class AddSaleItemDto {
  @IsString()
  barcode!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}
