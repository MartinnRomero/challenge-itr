import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventsService } from 'src/api/events/services/events.service';

@Injectable()
export class ProductEventsService {
  constructor(private readonly events: EventsService) {}

  @OnEvent('product.created')
  onProductCreated(payload: { productId: number }) {
    console.log('Product created', payload);
    this.events.emit({ type: 'product.created', data: payload });
  }

  @OnEvent('product.variation.created')
  onProductVariationCreated(payload: { productVariationId: number }) {
    console.log('Product variation created', payload);
    this.events.emit({ type: 'product.variation.created', data: payload });
  }
}