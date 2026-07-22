import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsOptional()
  @IsString()
  barcode?: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsInt()
  categoryId!: number;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsString()
  @IsNotEmpty()
  unit!: string;

  @IsNumber()
  purchasePrice!: number;

  @IsNumber()
  retailPrice!: number;

  @IsOptional()
  @IsNumber()
  wholesalePrice?: number;

  @IsOptional()
  @IsNumber()
  mrp?: number;

  @IsInt()
  @Min(0)
  currentStock!: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
