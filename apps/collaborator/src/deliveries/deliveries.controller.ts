import { Body, Controller, Delete, Get, Param, Post, Put, Patch, UseGuards } from '@nestjs/common';
import { Roles } from '../../../shared/decorators/role.decorator';
import { AuthorizationGuard } from '../../../shared/security/authorization.guard';
import Role from '../../../shared/security/role.model';
import { DeliveryStatusEnum } from '../../../shared/enums';
import { Deliveries, TrackEvents } from '../../../shared/interfaces/deliveries.interface';
import { DeliveriesService } from './deliveries.service';

@Controller('deliveries')
export class DeliveriesController {
  constructor(
    private readonly deliveriesService: DeliveriesService
  ) { }

  @Put('/change-status/:id')
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER, Role.COLLABORATOR)
  async updatStatusDelivery(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('track_event') track_event: TrackEvents
  ): Promise<any> {
    return await this.deliveriesService.updateStatusDelivery(id, status, track_event);
  }

  @Put('/update/:id')
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER, Role.COLLABORATOR)
  async update(@Param('id') id: string, @Body() delivery: Deliveries): Promise<any> {
    return await this.deliveriesService.update(id, delivery);
  }

  @Post()
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER, Role.USER)
  async create(@Body() deliveries: Deliveries): Promise<any> {
    return await this.deliveriesService.create(deliveries);
  }

  @Get('/get-all')
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER, Role.USER)
  async findAll(): Promise<any> {
    return await this.deliveriesService.findAll();
  }

  @Get('/get-one/:id')
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER, Role.COLLABORATOR, Role.USER)
  async findOne(@Param('id') id: string): Promise<any> {
    return await this.deliveriesService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER)
  async remove(@Param('id') id: string): Promise<any> {
    return await this.deliveriesService.remove(id);
  }

  @Get('/status/:id')
  @UseGuards(AuthorizationGuard)
  @Roles(Role.USER)
  async getStatus(@Param('id') id: string): Promise<DeliveryStatusEnum> {
    return await this.deliveriesService.getStatus(id);
  }


}
