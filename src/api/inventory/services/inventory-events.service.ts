import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InventoryService } from './inventory.service';

@Injectable()
export class InventoryEventsService {
  constructor(private readonly inventoryService: InventoryService) {}

  @OnEvent('product.variation.created')
  onProductVariationCreated(payload: { productVariationId: number }) {
    console.log('Product variation created', payload);
    this.inventoryService.createInventory({
      productVariationId: payload.productVariationId,
      countryCode: 'EG',
      quantity: 0,
    });
  }
}