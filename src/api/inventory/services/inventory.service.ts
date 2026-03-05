import { Injectable } from '@nestjs/common';
import { CreateInventoryDto } from '../dto/invetory.dto';
import { InventoryRepository } from '../repositories/inventory.repository';

@Injectable()
export class InventoryService {
  constructor(
    private readonly inventoryRepository: InventoryRepository,
  ) {}

  async getAllInventories() {
    const inventories = await this.inventoryRepository.findAll();
    return inventories;
  }

  async createInventory(data: CreateInventoryDto) {
    const inventory = this.inventoryRepository.create({
      productVariationId: data.productVariationId,
      countryCode: data.countryCode,
      quantity: data.quantity,
    });

    return this.inventoryRepository.save(inventory);
  }
}
