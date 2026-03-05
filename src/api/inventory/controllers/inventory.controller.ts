import { Body, Controller, Get, Post } from '@nestjs/common';
import { InventoryService } from '../services/inventory.service';
import { Auth } from 'src/api/auth/guards/auth.decorator';
import { RoleIds } from 'src/api/role/enum/role.enum';
import { CreateInventoryDto } from '../dto/invetory.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('')
  async getInventory() {
    return this.inventoryService.getAllInventories();
  }

  @Auth(RoleIds.Admin, RoleIds.Merchant)
  @Post('create')
  async createInventory(@Body() body: CreateInventoryDto) {
    return this.inventoryService.createInventory(body);
  }
}
