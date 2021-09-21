import { Injectable } from '@nestjs/common';
// import { client, getAsync, keysAsync } from '../../../config/database/redis.config';
import { FormatedGoogleMapsAddress, RedisData } from '../../shared/interfaces';
import { omit } from 'lodash';
import * as aws from 'aws-sdk';
import { getPartner } from '../config/apisauce-partner.config';
import { getOrder } from '../config/apisauce-client.config';
import { distanceTo, LatLon } from 'geolocation-utils';
import { getLocation } from '../config/apisauce-google-maps';

@Injectable()
export class GeolocationService {

  async setCache(redisData: RedisData) {
    const key = `${redisData.prefix}${redisData.collaborator_id}`
    // const data = omit(redisData, 'prefix')

    const { order_id, partner_id, longitude, latitude } = redisData;

    const partner = await getPartner(partner_id);
    const order = await getOrder(order_id);

    const collaboratorLatLon: LatLon = { lat: latitude, lon: longitude };
    const partnerLatLon: LatLon = { lat: partner.location.latitude, lon: partner.location.longitude };

    const distance_to_partner = distanceTo(collaboratorLatLon, partnerLatLon);

    const clientLatLon: LatLon = { lat: order.delivery_address.latitude, lon: order.delivery_address.longitude };

    const distance_to_client = distanceTo(collaboratorLatLon, clientLatLon);

    const data = {
      ...omit(redisData, 'prefix'),
      distance_to_client,
      distance_to_partner
    };

    // Set Redis TTL
    // return await client.set(key, JSON.stringify(data), 'EX', 120);

    // const cache = await client.set(key, JSON.stringify(data));
    const sqs = new aws.SQS({ apiVersion: process.env.API_VERSION });

    // if (cache) {
    //   this.sendMessageSQS(cache, sqs);
    // }
  }

  private sendMessageSQS(cache: any, sqs: aws.SQS) {
    const params: any = {
      MessageBody: JSON.stringify(cache),
      QueueUrl: process.env.QUEUE_URL
    };
    sqs.sendMessage(params, (err, data) => {
      if (err) {
        console.log("Error", err);
      }
      else {
        return data.MessageId;
      }
    });
  }

  async getByKey(key) {
    // return await getAsync(key);
  }

  async getAllByPrefix(prefix: string) {
    // const keys = await keysAsync(`${prefix}*`);
    // if (keys.length > 0) {
    //   return Promise.all(keys.map(async key => {
    //     const cache = await getAsync(key);
    //     return JSON.parse(cache);
    //   }));
    // };
    return [];
  }

  async getGoogleMapsLocation(query: any): Promise<FormatedGoogleMapsAddress[]> {
    const respGoogleMaps = await getLocation(query.input)
    if(respGoogleMaps) return this.formatGoogleMapsResponse(respGoogleMaps)
  }

  formatGoogleMapsResponse(googleMapsResp: any[]): FormatedGoogleMapsAddress[] {
    return googleMapsResp.map(item => ({
      place_id: item.place_id,
      primary_address: item.structured_formatting.main_text,
      secundary_address: item.structured_formatting.secondary_text,
    }))
  }
}
