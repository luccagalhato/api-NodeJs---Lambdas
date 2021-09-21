import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ScanResponse } from 'dynamoose/dist/DocumentRetriever';
import { DeliveryStatusEnum } from '../../../shared/enums';
import { Deliveries } from '../../../shared/interfaces/deliveries.interface';
import { deliveriesModel } from '../../../shared/models/deliveries.model';
import { omit } from 'lodash';
import { CookieStorage } from 'amazon-cognito-identity-js';

@Injectable()
export class DeliveriesService {

  async create(deliveries: Deliveries): Promise<Deliveries> {
    try {
      return await deliveriesModel.create(deliveries);
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async update(id: string, deliveries: Partial<Deliveries>): Promise<Deliveries> {
    try {
      return await deliveriesModel.update({ id }, deliveries)
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      await deliveriesModel.delete(id);
      return true
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findOne(id: string): Promise<Deliveries> {
    try {
      return await deliveriesModel.get(id);
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findAll(): Promise<ScanResponse<Deliveries>> {
    try {
      return await deliveriesModel.scan().exec();
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async getStatus(id): Promise<DeliveryStatusEnum> {
    try {
      const delivery = await this.findOne(id);
      return delivery.status;
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async updateStatusDelivery(id: string, status, track_event): Promise<any> {
    const delivery = await deliveriesModel.get(id);
    const data = {
      ...omit(delivery, ['id', 'createdAt', 'updatedAt']),
      status,
      track_events: delivery.track_events.push(track_event)
    }
    return await deliveriesModel.update({ id }, data);
  }
}