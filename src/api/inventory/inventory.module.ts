import { Module } from '@nestjs/common';
import { InventoryService } from './services/inventory.service';
import { InventoryController } from './controllers/inventory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from 'src/database/entities/inventory.entity';
import { UserModule } from '../user/user.module';
import { InventoryEventsService } from './services/inventory-events.service';
import { InventoryRepository } from './repositories/inventory.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory]), UserModule],
  providers: [InventoryService, InventoryEventsService, InventoryRepository],
  controllers: [InventoryController],
})
export class InventoryModule {}