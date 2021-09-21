import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ScanResponse } from 'dynamoose/dist/DocumentRetriever';
import { Orders } from '../../../shared/interfaces';
import { OrdersService } from './orders.service';
import { DeliveryStatusEnum } from '../../../shared/enums';
import Role from '../../../shared/security/role.model';
import { Roles } from '../../../shared/decorators/role.decorator';
import { AuthorizationGuard } from '../../../shared/security/authorization.guard';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly orderService: OrdersService
  ) { }

  // TODO: Review Endpoint path Find All
  @Get('/get-all/')
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER)
  async findAll(): Promise<ScanResponse<Orders>> {
    return await this.orderService.findAll()
  }

  @Get('/get-one/:id') 
  // @UseGuards(AuthorizationGuard)
  // @Roles(Role.PARTNER)
  async findOne(@Param('id') id: string) {
    return await this.orderService.findOne(id);
  }

  @Put('/update-status/:id')
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: DeliveryStatusEnum,
  ) {
    return await this.orderService.update({ id }, status);
  }

  @Post()
  //@UseGuards(AuthorizationGuard)
  //@Roles(Role.USER)
  async create(@Body() body: Orders): Promise<Orders> {
    return await this.orderService.create(body);
  }
}
