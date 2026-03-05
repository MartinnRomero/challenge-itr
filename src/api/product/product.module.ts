import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { Category } from '../../database/entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { User } from '../../database/entities/user.entity';
import { Product } from 'src/database/entities/product.entity';
import { ProductRepository } from './repositories/product.repository';
import { ProductEventsService } from './services/product-events.service';
import { EventsModule } from '../events/events.module';
import { ProductVariation } from 'src/database/entities/productVariation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Category, ProductVariation]), UserModule, EventsModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, ProductEventsService],
})
export class ProductModule {}
