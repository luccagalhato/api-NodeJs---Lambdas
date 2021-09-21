import { Document } from "dynamoose/dist/Document";
import { Collaborator } from "./collaborator.interface";

export * from "./authentication.interface";
export * from "./collaborator.interface";
export * from "./products.interface";
export * from "./partners.interface";
export * from "./orders.interface";

export interface Category extends Document {
  id?: string;
  name: string;
  department: string;
  icon_url: string;
}

export interface Catalog extends Document {
  id?: string;
  name: string;
  partner_id: string;
  section_id: number;
  categories: string[];
  items: string[];
}

export interface ClosestCollaborator extends Collaborator {
  distance: number;
  latitude: number;
  longitude: number;
}

export interface RedisData {
  prefix?: string;
  order_id: string;
  collaborator_id: string;
  latitude: number;
  longitude: number;
  partner_id: string;
  client_id: string;

  distance_to_partner: number;
  distance_to_client: number;
}

export interface FormatedGoogleMapsAddress {
  primary_address: string;
  secundary_address: string;
  place_id: string;
}

export interface OperationalTime {
  open_time: Date;
  end_time: Date;
}
