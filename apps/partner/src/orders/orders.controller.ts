import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { Roles } from '../../../shared/decorators/role.decorator';
import { AuthorizationGuard } from '../../../shared/security/authorization.guard';
import Role from '../../../shared/security/role.model';
import { DeliveryStatusEnum } from '../../../shared/enums';
import { OrdersService } from './orders.service'

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Get()
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER)
  async showStatus(): Promise<any> {
    return await this.ordersService.showRecentOrders();
  }

  @Put('update-status/:id')
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER)
  async updateStatusOrder(@Param('id') id: string, @Body('status') status: DeliveryStatusEnum): Promise<any> {
    return await this.ordersService.updateStatusOrder(id, status)
  }
}
