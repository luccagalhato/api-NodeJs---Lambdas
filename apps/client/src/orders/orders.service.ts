import { Injectable } from '@nestjs/common';
import { ScanResponse } from 'dynamoose/dist/DocumentRetriever';
import { publishSNS } from '../../../shared/aws/sns-methods';
import { Orders } from '../../../shared/interfaces';
import { ordersModel } from '../../../shared/models';
import * as moment from 'moment';
import { Deliveries } from '../../../shared/interfaces/deliveries.interface';
import { createDelivery } from '../../../partner/config/apisauce-collaborator';
import { DeliveryStatusEnum } from '../../../shared/enums';
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class OrdersService {

  async findOne(id: string) {
    return ordersModel.get(id);
  }

  async create(order: Orders): Promise<Orders> {
    try {

      order.preparation_start = moment(order.preparation_start).toDate();
      const createdOrder = await ordersModel.create(order);

      const delivery: Deliveries = {
        order_info: {
          order_id: createdOrder.id,
          partner_id: createdOrder.partner_id,
          clientLatitude: createdOrder.delivery_address.latitude,
          clientLongitude: createdOrder.delivery_address.longitude,
        },
        status: DeliveryStatusEnum.NEW_ORDER,
        track_events: [{
          created_at: `${new Date()}`,
          event: DeliveryStatusEnum.NEW_ORDER,
          latitude: createdOrder.delivery_address.latitude,
          longitude: createdOrder.delivery_address.longitude,
          id: uuidv4
        }]
      }

      const createdDelivery = await createDelivery(delivery)

      // TODO: isolate env variables
      const topicArn = process.env.CREATE_ORDER_ARN;

      const snsMessage = `Client created order`;
      const messageAttributes = {
        // @ts-ignore
        delivery_id: { DataType: 'String', StringValue: createdDelivery.id },
        order_id: { DataType: 'String', StringValue: createdOrder.id },
        partner_id: { DataType: 'String', StringValue: createdOrder.partner_id }
      }

      publishSNS(snsMessage, topicArn, messageAttributes);

      return createdOrder;

    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }

  async findAll(): Promise<ScanResponse<Orders>> {
    try {
      return await ordersModel.scan().exec();
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }

  async update(id, delivery) {
    return await ordersModel.update({ id }, delivery);
  }
}
