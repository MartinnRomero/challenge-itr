import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { CreateProductDto, CreateProductVariationDto, ProductDetailsDto } from '../dto/product.dto';
import { Category } from '../../../database/entities/category.entity';
import { errorMessages } from 'src/errors/custom';
import { validate } from 'class-validator';
import { successObject } from 'src/common/helper/sucess-response.interceptor';
import { ProductRepository } from '../repositories/product.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ProductService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly productRepository: ProductRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getAllProducts() {
    const products = await this.productRepository.findAll();
    return products;
  }

  async getProduct(productId: number) {
    const product = await this.productRepository.findById(productId);

    if (!product) throw new NotFoundException(errorMessages.product.notFound);

    return product;
  }

  async createProduct(data: CreateProductDto, merchantId: number) {
    const category = await this.entityManager.findOne(Category, {
      where: {
        id: data.categoryId,
      },
    });

    if (!category) throw new NotFoundException(errorMessages.category.notFound);

    const product = this.productRepository.create({
      category,
      merchantId,
      ...data,
    });

    const productSaved = await this.productRepository.save(product);

    this.eventEmitter.emit('product.created', {
      productId: product.id,
    });

    return productSaved;
  }

  async addProductDetails(
    productId: number,
    body: ProductDetailsDto,
    merchantId: number,
  ) {
    const updated = await this.productRepository.updateDetails(
      productId,
      merchantId,
      body,
    );

    if (!updated) throw new NotFoundException(errorMessages.product.notFound);

    return updated;
  }

  async activateProduct(productId: number, merchantId: number) {
    if (!(await this.validate(productId)))
      throw new ConflictException(errorMessages.product.notFulfilled);

    const updated = await this.productRepository.activateProduct(
      productId,
      merchantId,
    );

    if (!updated) throw new NotFoundException(errorMessages.product.notFound);

    return updated;
  }

  async validate(productId: number) {
    const product = await this.productRepository.findById(productId);
    if (!product) throw new NotFoundException(errorMessages.product.notFound);
    const errors = await validate(product);

    if (errors.length > 0) return false;

    return true;
  }

  async deleteProduct(productId: number, merchantId: number) {
    const deleted = await this.productRepository.deleteByIdAndMerchant(
      productId,
      merchantId,
    );

    if (!deleted)
      throw new NotFoundException(errorMessages.product.notFound);

    return successObject;
  }

  async createProductVariation(
    merchantId: number,
    body: CreateProductVariationDto,
  ) {
    const product = await this.productRepository.findById(body.productId);

    if (!product || product.merchantId !== merchantId) {
      throw new NotFoundException(errorMessages.product.notFound);
    }

    const variation = await this.productRepository.createProductVariation({
      ...body
    });

    console.log(variation);
    const productVariationSaved = await this.productRepository.saveProductVariation(variation);

    this.eventEmitter.emit('product.variation.created', {
      productVariationId: productVariationSaved.id,
    });

    return productVariationSaved;
  }
}
