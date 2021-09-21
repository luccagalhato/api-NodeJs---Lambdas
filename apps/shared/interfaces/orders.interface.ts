import { Document } from 'dynamoose/dist/Document';

export interface ItemOption extends Document {
  name: String;
  quantity: Number;
  unit_price: Number;
}

export interface OptionGroup extends Document {
  name: String;
  option_items: ItemOption[]
}

export interface ItemOrder extends Document {
  sku: String;
  name: String;
  quantity: Number;
  unit_price: Number;
  options: OptionGroup[]
}

export interface Orders extends Document {
  id: string;
  delivery_fee: number;
  sub_total_value: number;
  total_value: number;
  preparation_start: Date;
  partner_id: string;
  delivery_address: {
    address: string,
    city: string,
    state: string,
    country: string,
    neighborhood: string,
    latitude: number,
    longitude: number,
    number: number,
    complement: string,
    zip_code: string,
  };
  status: string;
  items: ItemOrder[],
  client_id: String
}
