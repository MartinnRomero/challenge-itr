import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from 'src/database/entities/inventory.entity';

@Injectable()
export class InventoryRepository {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
  ) {}

  async findAll(): Promise<Inventory[]> {
    return this.inventoryRepo.find();
  }

  create(data: Partial<Inventory>): Inventory {
    return this.inventoryRepo.create(data);
  }

  async save(inventory: Inventory): Promise<Inventory> {
    return this.inventoryRepo.save(inventory);
  }
}
