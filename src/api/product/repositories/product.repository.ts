import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/database/entities/product.entity';
import { ProductVariation } from 'src/database/entities/productVariation.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductVariation)
    private readonly productVariationRepo: Repository<ProductVariation>,
  ) {}

  async findById(productId: number): Promise<Product | null> {
    return this.productRepo.findOne({
      where: {
        id: productId,
      },
    });
  }

  async findAll(): Promise<Product[]> {
    return this.productRepo.find();
  }

  create(data: Partial<Product>): Product {
    return this.productRepo.create(data);
  }

  async save(product: Product): Promise<Product> {
    return this.productRepo.save(product);
  }

  async saveProductVariation(variation: ProductVariation): Promise<ProductVariation> {
    return this.productVariationRepo.save(variation);
  }

  async updateDetails(
    productId: number,
    merchantId: number,
    details: Partial<Product>,
  ): Promise<{ id: number } | null> {
    const result = await this.productRepo
      .createQueryBuilder()
      .update(Product)
      .set(details)
      .where('id = :id', { id: productId })
      .andWhere('merchantId = :merchantId', { merchantId })
      .returning(['id'])
      .execute();

    if (result.affected && result.affected > 0) {
      return result.raw[0];
    }

    return null;
  }

  async activateProduct(
    productId: number,
    merchantId: number,
  ): Promise<{ id: number; isActive: boolean } | null> {
    const result = await this.productRepo
      .createQueryBuilder()
      .update(Product)
      .set({
        isActive: true,
      })
      .where('id = :id', { id: productId })
      .andWhere('merchantId = :merchantId', { merchantId })
      .returning(['id', 'isActive'])
      .execute();

    if (result.affected && result.affected > 0) {
      return result.raw[0];
    }

    return null;
  }

  async deleteByIdAndMerchant(
    productId: number,
    merchantId: number,
  ): Promise<boolean> {
    const result = await this.productRepo
      .createQueryBuilder()
      .delete()
      .from(Product)
      .where('id = :productId', { productId })
      .andWhere('merchantId = :merchantId', { merchantId })
      .execute();

    return !!result.affected && result.affected > 0;
  }

  async findProductVariationById(productVariationId: number): Promise<ProductVariation | null> {
    return this.productVariationRepo.findOne({
      where: {
        id: productVariationId,
      },
    });
  }

  async createProductVariation(data: Partial<ProductVariation>): Promise<ProductVariation> {
    return this.productVariationRepo.create(data);
  }
}
