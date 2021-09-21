import { Injectable } from '@nestjs/common';
import { ordersModel } from '../../../shared/models/orders.model'
import { DocumentModelType } from '../../../shared/@types';
import { updateStatusDelivery } from '../../config/apisauce-collaborator';
import { DeliveryStatusEnum } from '../../../shared/enums';

@Injectable()
export class OrdersService {
  async showRecentOrders(): Promise<DocumentModelType<any>> {
    try {
      const result = await ordersModel.get('*');
      return result
    } catch (error) {
      throw new Error(error)
    }

  }

  async updateStatusOrder(id: string, status: DeliveryStatusEnum): Promise<DocumentModelType<any>> {
    try {
      return await ordersModel.update({ "id": id }, { "status": status });
    } catch (err) {
      console.error(err)
      throw new Error(err)
    }
  }
}
