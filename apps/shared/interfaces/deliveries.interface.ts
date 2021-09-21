import { DeliveryStatusEnum } from '../enums';

export interface Deliveries {
  id?: string;
  order_info: {
    order_id: string;
    partner_id: string;
    partnerLatitude?: number;
    partnerLongitude?: number;
    clientLatitude: number;
    clientLongitude: number;
  };
  collaborator_id?: string;
  collaborator_status?: string;
  status: DeliveryStatusEnum;
  track_events?: TrackEvents[];
}

export interface TrackEvents {
  id: string,
  event: string,
  latitude?: number,
  longitude?: number,
  description?: string,
  created_at?: string
}
