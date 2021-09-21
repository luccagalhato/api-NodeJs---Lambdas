import { HttpException, Injectable } from '@nestjs/common';
import {
  Clients,
  DeliveryAddress,
} from '../../shared/interfaces/clients.interface';
import { clientsModel } from '../../shared/models/clients.model';
import { DocumentModelType } from '../../shared/@types';
import { OrdersService } from './orders/orders.service';
import { DeliveryStatusEnum } from '../../shared/enums';
import { getDelivery, updateDelivery } from '../config/apisauce-collaborator';
import { v4 as uuidv4 } from 'uuid';
import { omit } from 'lodash';
import { publishSNS, confirmSNS } from '../../shared/aws/sns-methods';
import {
  getFullGoogleAddressByLatLng,
  getFullGoogleAddressByPlaceId,
} from '../config/apisauce-google-maps';
import { FormatedGoogleMapsAddress } from '../../shared/interfaces';
import { handleAddressComponentsToDelivery } from './helpers';
// import { client } from 'config/database/redis.config';
import { CardTokenResponse } from '../../../libs/juno/src/responses';
import NotFoundException from '../../shared/exceptions/not-found.exception';

@Injectable()
export class ClientService {
  constructor(private readonly orderService: OrdersService) {}

  async createClient(clients: Partial<Clients>): Promise<any> {
    const register = await clientsModel.get(clients.id);
    if (register) {
      throw new HttpException(
        {
          error: 'Usuário já existe',
        },
        409,
      );
    }
    return clientsModel.create(clients);
  }

  async update(id: string, clients: Partial<Clients>): Promise<Clients> {
    return clientsModel.update({ id }, clients);
  }

  async findOne(id: string) {
    const resp = await clientsModel.scan({ id: id }).exec();
    return resp[0];
  }

  async remove(id: string): Promise<DocumentModelType<any>> {
    return await clientsModel.delete({ id });
  }

  async findAll(): Promise<DocumentModelType<any>> {
    return await clientsModel.scan().exec();
  }

  async getUserCreditCards(id: string) {
    const [cards] = await clientsModel
      .scan({ id })
      .attributes(['payments_cards'])
      .exec();

    return cards;
  }

  async orderDelivered(deliveryId, orderId) {
    await this.orderService.update(orderId, DeliveryStatusEnum.DELIVERED);

    const delivery = await getDelivery(deliveryId);

    if (delivery) {
      const track_event = {
        id: uuidv4(),
        event: 'Esperando cliente para entrega do Pedido!',
        created_at: `${new Date()}`,
      };

      delivery.status = DeliveryStatusEnum.WAITING_CLIENT;
      delivery.track_events.push(track_event);

      await updateDelivery(
        delivery.id,
        omit(delivery, ['id', 'createdAt', 'updatedAt']),
      );
    } else {
      throw new HttpException(
        `Delivery not Found dliveryID ${deliveryId}`,
        404,
      );
    }

    const topicArn = process.env.ORDER_DELIVERED_ARN;

    const snsMessage = `Esperando cliente para entrega do Pedido!`;

    const messageAttributes = {
      delivery_id: { DataType: 'String', StringValue: deliveryId },
      order_id: { DataType: 'String', StringValue: orderId },
    };

    publishSNS(snsMessage, topicArn, messageAttributes);
  }

  /**
   * Save all Devilery Address with FormatedGoogleMapsAddress Parameter
   * This method saved all address
   * @param id
   * @param googleAddress
   * @returns
   */
  async updateAddressGoogleLocation(
    id: string,
    googleAddress: FormatedGoogleMapsAddress,
  ) {
    const completeAddress = await getFullGoogleAddressByPlaceId(
      googleAddress.place_id,
    );
    const { place_id, address_components, geometry } = completeAddress;

    const {
      postal_code,
      city,
      street,
      district,
      state,
      country,
      number,
    } = handleAddressComponentsToDelivery(address_components);
    const { lat: latitude, lng: longitude } = geometry.location;

    const address: DeliveryAddress = {
      place_id,
      postal_code,
      city,
      street,
      district,
      state,
      country,
      number,
      latitude,
      longitude,
    };

    const client = await this.findOne(id);

    const addresses = new Map();
    const pastAddresses = client.delivery_address ?? [];
    pastAddresses.forEach(item => {
      addresses.set(item.place_id, item);
    });
    addresses.set(address.place_id, address);

    await this.update(id, {
      delivery_address: Array.from(addresses, ([, value]) => value),
    });

    return address;
  }

  /**
   * Save Address by latitude and lotitude
   * @param id string
   * @param lat number
   * @param lng number
   * @returns
   */
  async updateAddressLatLng(id: string, lat: number, lng: number) {
    const completeAddress = await getFullGoogleAddressByLatLng(lat, lng);
    const { place_id, address_components, geometry } = completeAddress;
    const {
      postal_code,
      city,
      street,
      district,
      state,
      country,
      number,
    } = handleAddressComponentsToDelivery(address_components);
    const { lat: latitude, lng: longitude } = geometry.location;

    const address: DeliveryAddress = {
      place_id,
      postal_code,
      city,
      street,
      district,
      state,
      country,
      number,
      latitude,
      longitude,
    };

    const client = await this.findOne(id);

    const addresses = new Map();
    const pastAddresses = client.delivery_address ?? [];
    pastAddresses.forEach(item => {
      addresses.set(item.place_id, item);
    });
    addresses.set(address.place_id, address);

    await this.update(id, {
      delivery_address: Array.from(addresses, ([, value]) => value),
    });

    return address;
  }

  /**
   * Save surname and details of Address
   * @param id string
   * @param placeId string
   * @param surname string
   * @param number string
   * @param referencePoint string
   * @param complement string
   * @returns
   */
  async updateAddressSurname(
    id: string,
    placeId: string,
    surname: string,
    number: number,
    referencePoint: string,
    complement: string,
  ) {
    const client = await this.findOne(id);

    const addresses: DeliveryAddress[] = client.delivery_address.map<
      DeliveryAddress
    >(address => {
      if (address.place_id === placeId) {
        address.surname = surname;
        address.number = number;
        address.reference_point = referencePoint;
        address.complement = complement;
      }

      return address;
    });

    return this.update(id, {
      default_place_id: placeId,
      delivery_address: addresses,
    });
  }

  async updatePaymentCreditCard(id: string, creditCard: CardTokenResponse) {
    const result = await clientsModel.scan({ id: id }).exec();
    const client = result[0];

    if (client) {
      const newCard = {
        internalId: uuidv4(),
        paymentGatewayId: creditCard.creditCardId,
        last4CardNumber: creditCard.last4CardNumber,
        expirationMonth: creditCard.expirationMonth,
        expirationYear: creditCard.expirationYear,
      };
      const { payments_cards = [] } = client;
      payments_cards.push(newCard);
      return this.update(id, { payments_cards });
    }
    return null;
  }

  async confirmSNStopic(topic: string, token: string) {
    //SendConfirmation
    confirmSNS(topic, token);
  }
}
