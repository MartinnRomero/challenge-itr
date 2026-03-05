import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateInventoryDto {
  @IsInt()
  @Min(1)
  public productVariationId: number;

  @IsString()
  @IsNotEmpty()
  public countryCode: string;

  @IsInt()
  @Min(0)
  public quantity: number;
}

export interface CreateInventoryDto {
    productVariationId: number;
    countryCode: string;
    quantity: number;
}