import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { variationTypesKeys } from 'src/database/entities/product.entity';
import { ProductDetails, ProductDetailsTypeFn } from './productDetails';

export interface CurrentUserDto {
  id: number;
  email: string;
  roles: number[];
}

export class CreateProductDto implements CreateProductDto {
  @IsNumber()
  @IsNotEmpty()
  public categoryId: number;
}

export class ProductDetailsDto {
  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsString()
  @IsNotEmpty()
  public code: string;

  @IsDefined()
  @IsString()
  @IsIn(variationTypesKeys)
  public variationType: string;

  @IsDefined()
  @Type(ProductDetailsTypeFn)
  @ValidateNested()
  public details: ProductDetails;

  @ArrayMinSize(1)
  @IsString({ each: true })
  public about: string[];

  @IsString()
  @IsNotEmpty()
  public description: string;
}

export class CreateProductVariationDto {
  @IsNumber()
  @IsPositive()
  public productId: number;

  @IsString()
  @IsNotEmpty()
  public sizeCode: string;

  @IsString()
  @IsNotEmpty()
  public colorName: string;

  @IsArray()
  @IsString({ each: true })
  public imageUrls?: string[];
}

export class CreateProductVariationPriceDto {
  @IsNumber()
  @IsPositive()
  public productVariationId: number;

  @IsString()
  @IsNotEmpty()
  public countryCode: string;

  @IsString()
  @IsNotEmpty()
  public currencyCode: string;

  @IsNumber()
  @Min(0)
  public price: number;
}

