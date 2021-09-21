import { Document } from 'dynamoose/dist/Document';

export interface Products extends Document{
  sku?: string;
  options: ItemOptionsGroup[];
  items: string[];
  description: string;
  image_url: string;
  visible: boolean;
  name: string;
  partner_id: string;
  price: number;
  tags: string[];
}

export interface ItemOptionsGroup extends Document {
  max_count: number;
  min_count: number;
  max_unique: number;
  section_name: string;
  section_id: number;
  option_items: ItemOptions[];
}

export interface ItemOptions extends Document {
  price: number;
  option_name: string;
  is_available: boolean;
  tags: string[];
}