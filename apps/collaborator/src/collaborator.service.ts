import { HttpException, Injectable } from "@nestjs/common";
import { Scan, ScanResponse } from "dynamoose/dist/DocumentRetriever";
import { isEmpty, omit } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { collaboratorGeoTableManager } from "../../../config/database/geo-config";
import { publishSNS, confirmSNS } from "../../shared/aws/sns-methods";
import { DeliveryStatusEnum } from "../../shared/enums";
import NotFoundException from "../../shared/exceptions/not-found.exception";
import { Collaborator } from "../../shared/interfaces";
import { collaboratorsModel, ordersModel, deliveriesModel, partnerModel } from "../../shared/models";
import { getAllCacheByPrefix } from "../config/apisauce-geolocation.config";
import { updateStatusOrder } from "../config/apisauce-partner.config";
import { DeliveriesService } from "./deliveries/deliveries.service";
import { findClosestCollaborator, simpleSortArrayByField } from "./helper";
import { handlerCreateCollaboratorGeoData } from "./helper/geo-manager-data";

@Injectable()
export class CollaboratorService {
  constructor(private readonly deliveryService: DeliveriesService) {}

  async create(collaborator: Collaborator): Promise<any> {
    const collaboratorGeoData = handlerCreateCollaboratorGeoData(collaborator);
    return collaboratorGeoTableManager.putPoint(collaboratorGeoData).promise();
  }

  async update(id: string, collaborator: any): Promise<any> {
    const item = await this.findOne(id);
    return await collaboratorsModel.update({
      geoKey: item.geoKey,
      rangeKey: item.rangeKey,
      ...collaborator,
    });
  }

  async updateIsOnline(id: string) {
    const register = await this.findOne(id);
    const isOnline = !register.is_online;
    return await collaboratorsModel.update(
      {
        geoKey: register.geoKey,
        rangeKey: register.rangeKey,
      },
      { is_online: isOnline }
    );
  }

  async updateToOffline(id: string) {
    const register = await this.findOne(id);
    return await collaboratorsModel.update(
      {
        geoKey: register.geoKey,
        rangeKey: register.rangeKey,
      },
      { is_online: false }
    );
  }

  async updateGeoLocation(id: string, collaborator: any): Promise<any> {
    const item = await this.findOne(id);

    if (!item)
      throw new HttpException("Bad Request - Collaborator not found!", 400);

    item.latitude = collaborator.latitude;
    item.longitude = collaborator.longitude;
    await this.remove(id);
    return await this.create(item);
  }

  async findOne(id: string) {
    const resp = await collaboratorsModel.scan({ id: id }).exec();
    return resp[0];
  }

  async remove(id: string) {
    const item = await this.findOne(id);
    return await collaboratorsModel.delete({
      geoKey: item.geoKey,
      rangeKey: item.rangeKey,
    });
  }

  async findAll(
    query
  ): Promise<ScanResponse<Collaborator> | Scan<Collaborator>> {
    if (!isEmpty(query)) {
      if (query.is_online)
        query.is_online = query.is_online === "true" ? true : false;
      if (query.is_available)
        query.is_available = query.is_available === "true" ? true : false;

      return await collaboratorsModel.scan(query).exec();
    }
    return await collaboratorsModel.scan().exec();
  }

  async haveNewDeliveries(id: string) {
    const resp = await deliveriesModel.scan({ collaborator_id: id, collaborator_status: DeliveryStatusEnum.WAITING_ACCEPT}).exec();
    return resp[0];
  }

  async historic(id: string) {
    const resp = await deliveriesModel.scan({ collaborator_id: id, collaborator_status: DeliveryStatusEnum.DELIVERY_ACCEPTED}).exec();
    return resp[0]
    // const result = [];
    // for (const delivery of resp) {
    //   const order_id = delivery.order_info.order_id;
    //   const order = await ordersModel.scan({ id: order_id}).exec();

    //   const partner_id = order[0].partner_id;
    //   const partner = await partnerModel.scan({ id: partner_id}).exec();

    //   result.push({order: order, partner: partner, delivery: delivery});
    // }
    // console.error(resp)
    // return {historic: result};
  }

  async getClosestCollaborator(partnerLatitude, partnerLongitude) {
    partnerLatitude = parseFloat(partnerLatitude);
    partnerLongitude = parseFloat(partnerLongitude);

    const availableCollaborators = await findClosestCollaborator(
      partnerLatitude,
      partnerLongitude,
      true
    );

    if (!availableCollaborators) {
      const cacheData = await getAllCacheByPrefix("collaborator");

      cacheData.sort((first, second) =>
        simpleSortArrayByField(first, second, "distance_to_client")
      );

      const collaborator = await this.findOne(cacheData[0].collaborator_id);

      return {
        ...collaborator,
        latitude: cacheData[0].latitude,
        location: cacheData[0].longitude,
        distance: cacheData[0].distance_to_client,
      };
    }

    return availableCollaborators;
  }

  async acceptDelivery(deliveryId: string, latitude: number, longitude: number) {
    const delivery = await this.deliveryService.findOne(deliveryId);

    if (delivery) {
      const track_event = {
        id: uuidv4(),
        event: DeliveryStatusEnum.DELIVERY_ACCEPTED,
        latitude: latitude,
        longitude: longitude,
        created_at: `${new Date()}`,
      };

      delivery.status = DeliveryStatusEnum.DELIVERY_ACCEPTED;
      delivery.collaborator_status = DeliveryStatusEnum.DELIVERY_ACCEPTED;
      delivery.track_events.push(track_event);

      await this.deliveryService.update(
        delivery.id,
        omit(delivery, ["id", "createdAt", "updatedAt"])
      );
    } else {
      throw new HttpException(
        `Delivery not Found dliveryID ${deliveryId}`,
        404
      );
    }
  }

  async refuseDelivery(deliveryId: string, orderId: string, latitude: number, longitude: number, refuseReason: string) {
    const delivery = await this.deliveryService.findOne(deliveryId);

    if (delivery) {
      const track_event = {
        id: uuidv4(),
        event: DeliveryStatusEnum.DELIVERY_REFUSED,
        description: `${refuseReason}: ${delivery.collaborator_id}`,
        latitude: latitude,
        longitude: longitude,
        created_at: `${new Date()}`,
      };

      delivery.status = DeliveryStatusEnum.DELIVERY_REFUSED;
      delivery.track_events.push(track_event);

      await this.updateToOffline(delivery.collaborator_id)

      const collaborator = await this.getClosestCollaborator(
        delivery.order_info.partnerLatitude,
        delivery.order_info.partnerLongitude,
      );

      delivery.collaborator_id = collaborator.id;
      delivery.collaborator_status = DeliveryStatusEnum.WAITING_ACCEPT;
      await this.deliveryService.update(
        delivery.id,
        omit(delivery, ["id", "createdAt", "updatedAt"])
      );
    } else {
      throw new HttpException(
        `Delivery not Found dliveryID ${deliveryId}`,
        404
      );
    }

    const snsMessage = `Collaborator Refused Order`;

    const messageAttributes = {
      delivery_id: { DataType: "String", StringValue: deliveryId },
      order_id: { DataType: "String", StringValue: orderId },
    };

    const topicArn = process.env.NEW_DELIVERYMAN_ARN;

    publishSNS(snsMessage, topicArn, messageAttributes);
  }

  async partnerArrive(deliveryId: string, orderId: string, latitude: number, longitude: number) {
    await updateStatusOrder(orderId, DeliveryStatusEnum.ON_THE_PARTNER);

    const delivery = await this.deliveryService.findOne(deliveryId);

    if (delivery) {
      const track_event = {
        id: uuidv4(),
        event: DeliveryStatusEnum.ON_THE_PARTNER,
        latitude: latitude,
        longitude: longitude,
        created_at: `${new Date()}`,
      };

      delivery.status = DeliveryStatusEnum.ON_THE_PARTNER;
      delivery.track_events.push(track_event);

      await this.deliveryService.update(
        delivery.id,
        omit(delivery, ["id", "createdAt", "updatedAt"])
      );
    } else {
      throw new HttpException(
        `Delivery not Found dliveryID ${deliveryId}`,
        404
      );
    }

    const snsMessage = `Collaborator on Partner`;

    const messageAttributes = {
      delivery_id: { DataType: "String", StringValue: deliveryId },
      order_id: { DataType: "String", StringValue: orderId },
    };

    const topicArn = process.env.ARRIVE_ON_PARTNER;

    publishSNS(snsMessage, topicArn, messageAttributes);
  }

  async pickedOrder(deliveryId: string, orderId: string, latitude: number, longitude: number) {
    await updateStatusOrder(orderId, DeliveryStatusEnum.WAY_TO_CLIENT);

    const delivery = await this.deliveryService.findOne(deliveryId);

    if (delivery) {
      const track_event = {
        id: uuidv4(),
        event: DeliveryStatusEnum.WAY_TO_CLIENT,
        latitude: latitude,
        longitude: longitude,
        created_at: `${new Date()}`,
      };

      delivery.status = DeliveryStatusEnum.WAY_TO_CLIENT;
      delivery.track_events.push(track_event);

      await this.deliveryService.update(
        delivery.id,
        omit(delivery, ["id", "createdAt", "updatedAt"])
      );
    } else {
      throw new HttpException(
        `Delivery not Found dliveryID ${deliveryId}`,
        404
      );
    }

    const snsMessage = `Collaborator Picked Order`;

    const messageAttributes = {
      delivery_id: { DataType: "String", StringValue: deliveryId },
      order_id: { DataType: "String", StringValue: orderId },
    };

    const topicArn = process.env.PICKED_ORDER_ARN;

    publishSNS(snsMessage, topicArn, messageAttributes);
  }

  async waitingClient(deliveryId: string, orderId: string, latitude: number, longitude: number) {
    await updateStatusOrder(orderId, DeliveryStatusEnum.WAITING_CLIENT);

    const delivery = await this.deliveryService.findOne(deliveryId);

    if (delivery) {
      const track_event = {
        id: uuidv4(),
        event: DeliveryStatusEnum.WAITING_CLIENT,
        latitude: latitude,
        longitude: longitude,
        created_at: `${new Date()}`,
      };

      delivery.status = DeliveryStatusEnum.WAITING_CLIENT;
      delivery.track_events.push(track_event);

      await this.deliveryService.update(
        delivery.id,
        omit(delivery, ["id", "createdAt", "updatedAt"])
      );
    } else {
      throw new HttpException(
        `Delivery not Found dliveryID ${deliveryId}`,
        404
      );
    }

    const topicArn = process.env.ORDER_HAS_ARRIVED_ARN;

    const snsMessage = `Esperando cliente para entrega do Pedido!`;

    const messageAttributes = {
      delivery_id: { DataType: "String", StringValue: deliveryId },
      order_id: { DataType: "String", StringValue: orderId },
    };

    publishSNS(snsMessage, topicArn, messageAttributes);
  }

  async deliveredOrder(deliveryId: string, orderId: string, latitude: number, longitude: number) {
    await updateStatusOrder(orderId, DeliveryStatusEnum.DELIVERED);

    const delivery = await this.deliveryService.findOne(deliveryId);

    if (delivery) {
      const track_event = {
        id: uuidv4(),
        event: DeliveryStatusEnum.DELIVERED,
        latitude: latitude,
        longitude: longitude,
        created_at: `${new Date()}`,
      };

      delivery.status = DeliveryStatusEnum.DELIVERED;
      delivery.track_events.push(track_event);

      await this.deliveryService.update(
        delivery.id,
        omit(delivery, ["id", "createdAt", "updatedAt"])
      );
    } else {
      throw new HttpException(
        `Delivery not Found dliveryID ${deliveryId}`,
        404
      );
    }

    const snsMessage = `Order Delivered id: ${orderId}`;
    const topicArn = process.env.ORDER_DELIVERED_ARN;

    // Message Attributes

    publishSNS(snsMessage, topicArn);
  }

  async confirmSNStopic(topic: string, token: string) {
    //SendConfirmation
    confirmSNS(topic, token);
  }
}
