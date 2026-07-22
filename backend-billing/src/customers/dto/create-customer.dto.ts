import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  customerNo!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsOptional()
  @IsString()
  alternatePhone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  openingBalance?: number;

  @IsOptional()
  @IsNumber()
  currentBalance?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
