import { Injectable } from '@nestjs/common';
import { OperationalTime, Partners } from '../../shared/interfaces';
import { partnerModel } from '../../shared/models';
import * as moment from 'moment';
import { SNS } from 'aws-sdk';
import { publishSNS, confirmSNS } from '../../shared/aws/sns-methods';
import {
  getClosestCollaborator,
  getDelivery,
  updateDelivery,
} from '../config/apisauce-collaborator';
import { omit } from 'lodash';
import { DeliveryStatusEnum } from '../../shared/enums';
import { v4 as uuidv4 } from 'uuid';
import { OrdersService } from './orders/orders.service';
import NotFoundException from '../../shared/exceptions/not-found.exception';
import { distanceTo, LatLon } from 'geolocation-utils';

const isOpenPartner = (openTime: Date, closeTime: Date): boolean => {
  const now = moment();
  const [date, month, year] = now
    .format('DD/MM/YYYY')
    .split('/')
    .map(item => parseInt(item));

  const formatedCloseTime = moment(closeTime).set({
    date: date,
    month: month - 1,
    year: year,
  });
  const formatedOpenTime = moment(openTime).set({
    date: date,
    month: month - 1,
    year: year,
  });
  const formatedNow = now.add(3, 'h');

  return (
    formatedOpenTime.isBefore(formatedNow) &&
    formatedCloseTime.isAfter(formatedNow)
  );
};

@Injectable()
export class PartnerService {
  constructor(private readonly orderService: OrdersService) { }
  async create(partner: Partial<Partners>): Promise<Partners> {
    if (partner.open_time && partner.end_time) {
      partner.open_time = moment(partner.open_time).toDate();
      partner.end_time = moment(partner.end_time).toDate();
    }
    return await partnerModel.create(partner);
  }

  setDistance(partners: Partners[], userLatLon: LatLon) {
    return partners.filter(partner => {
      const partnerLatLon = {
        lat: partner.location.latitude,
        lon: partner.location.longitude,
      };
      return distanceTo(partnerLatLon, userLatLon) <= partner.radius;
    });
  }

  async findAll(
    city?: string,
    latLon?: LatLon,
    categories?: string,
  ): Promise<Partners[]> {
    const partners = await partnerModel
      .scan({
        'location.city': city,
      })
      .exec();

    let filteredPartners: Partners[] = partners;

    if (categories) {
      filteredPartners = partners.filter(partner => {
        const partnerCategories = partner.categories;
        if (!partnerCategories) {
          return false;
        }
        for (let indice = 0; indice < partnerCategories.length; indice++) {
          const category = partnerCategories[indice];
          if (categories.split(',').indexOf(category) >= 0) {
            return true;
          }
        }
        return false;
      });
    }

    return this.setDistance(filteredPartners, latLon);
  }

  async findOne(id: string): Promise<Partners> {
    const resp = await partnerModel.scan({ id: id }).exec();
    return resp[0];
  }

  async updateIsOnline(id: string) {
    const register = await this.findOne(id);
    const isOnline = !register.is_online;
    return await partnerModel.update({ id: id }, { is_online: isOnline });
  }

  // TODO: When update nested object - bug (ex: try update longitude latitude)
  async update(id: string, partner: Partial<Partners>) {
    partner.open_time = new Date(partner.open_time);
    partner.end_time = new Date(partner.end_time);
    return await partnerModel.update({ id }, partner);
  }

  async isInOperation(id: string): Promise<boolean> {
    const { end_time, open_time } = await this.getOperationTime(id);
    return isOpenPartner(end_time, open_time);
  }

  async getOperationTime(id: string): Promise<OperationalTime> {
    const { end_time, open_time } = await this.findOne(id);
    return { end_time, open_time };
  }

  async delete(id: string): Promise<boolean> {
    try {
      return Boolean(await partnerModel.delete({ id }));
    } catch (err) {
      console.error(err);
    }
  }

  async getAllInOperation(city: string, latLon: LatLon) {
    const partners = await this.findAll(city, latLon);
    return partners.filter(item =>
      isOpenPartner(item.open_time, item.end_time),
    );
  }

  async snsConfirmOrder(
    orderId: string,
    partnerId: string,
    deliveryId: string,
  ) {
    const partner: Partners = await this.findOne(partnerId);

    const collaborator = await getClosestCollaborator(
      partner.location.latitude,
      partner.location.longitude,
    );

    await this.orderService.updateStatusOrder(
      orderId,
      DeliveryStatusEnum.PREPARING,
    );

    const delivery = await getDelivery(deliveryId);

    delivery.order_info = {
      ...delivery.order_info,
      partner_id: partnerId,
      partnerLatitude: partner.location.latitude,
      partnerLongitude: partner.location.longitude,
    };
    delivery.collaborator_id = collaborator.id;
    delivery.collaborator_status = DeliveryStatusEnum.WAITING_ACCEPT;
    delivery.status = DeliveryStatusEnum.PREPARING;
    const track_event = {
      id: uuidv4(),
      event: DeliveryStatusEnum.PREPARING,
      latitude: partner.location.latitude,
      longitude: partner.location.longitude,
      created_at: `${new Date()}`,
    };

    delivery.track_events.push(track_event);

    await updateDelivery(
      deliveryId,
      omit(delivery, ['id', 'createdAt', 'updatedAt']),
    );

    const messageAttributes: SNS.MessageAttributeMap = {
      delivery_id: { DataType: 'String', StringValue: deliveryId },
      order_id: { DataType: 'String', StringValue: orderId },
      partner_id: { DataType: 'String', StringValue: partnerId },
      collaborator_id: { DataType: 'String', StringValue: collaborator.id },
    };

    const topicArn = process.env.ACCEPT_ORDER_ARN;
    const snsMessage = `order accepted - order_id: ${orderId}`;
    publishSNS(snsMessage, topicArn, messageAttributes);
  }

  async snsRefuseOrder(
    orderId: string,
    partnerId: string,
    deliveryId: string,
    refuseReason: string,
  ) {
    const partner: Partners = await this.findOne(partnerId);

    await this.orderService.updateStatusOrder(
      orderId,
      DeliveryStatusEnum.ORDER_REFUSED,
    );

    const delivery = await getDelivery(deliveryId);

    delivery.order_info = {
      ...delivery.order_info,
      partner_id: partnerId,
      partnerLatitude: partner.location.latitude,
      partnerLongitude: partner.location.longitude,
    };
    const track_event = {
      id: uuidv4(),
      event: DeliveryStatusEnum.ORDER_REFUSED,
      description: refuseReason,
      latitude: partner.location.latitude,
      longitude: partner.location.longitude,
      created_at: `${new Date()}`,
    };

    delivery.track_events.push(track_event);

    await updateDelivery(
      deliveryId,
      omit(delivery, ['id', 'createdAt', 'updatedAt']),
    );

    const messageAttributes: SNS.MessageAttributeMap = {
      order_id: { DataType: 'String', StringValue: orderId },
      partner_id: { DataType: 'String', StringValue: partnerId },
    };

    const topicArn = process.env.REFUSE_ORDER_ARN;
    const snsMessage = `Order Refused - order_id: ${orderId}`;
    publishSNS(snsMessage, topicArn, messageAttributes);
  }

  async snsOrderIsReady(deliveryId, orderId) {
    const topicArn = process.env.ORDER_READY_ARN;
    const message = `Order for delivery ${deliveryId} is Ready`;
    const messageAttributes = {
      delivery_id: { DataType: 'String', StringValue: deliveryId },
      order_id: { DataType: 'String', StringValue: orderId },
    };

    await this.orderService.updateStatusOrder(
      orderId,
      DeliveryStatusEnum.WAITING_COLLABORATOR,
    );

    const delivery = await getDelivery(deliveryId);

    const track_event = {
      id: uuidv4(),
      event: 'Pedido Pronto, esperando o entregador!',
      created_at: `${new Date()}`,
    };

    delivery.status = DeliveryStatusEnum.WAITING_COLLABORATOR;
    delivery.track_events.push(track_event);

    await updateDelivery(
      delivery.id,
      omit(delivery, ['id', 'createdAt', 'updatedAt']),
    );

    publishSNS(message, topicArn, messageAttributes);
  }

  async confirmSNStopic(topic: string, token: string) {
    //SendConfirmation
    confirmSNS(topic, token);
  }
}
