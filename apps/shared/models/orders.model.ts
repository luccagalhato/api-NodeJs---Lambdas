import * as dynamoose from 'dynamoose';
import { DocumentModelType } from '../@types';
import { Orders } from '../interfaces';
import { v4 as uuidv4 } from 'uuid';
import { DeliveryStatusEnum } from '../enums';

const ordersSchema = new dynamoose.Schema({
  id: {
    type: String,
    default: uuidv4
  },
  delivery_fee: Number,
  sub_total_value: Number,
  total_value: Number,
  client_id: String,
  partner_id: String,
  delivery_address: {
    type: Object,
    schema: {
      address: String,
      city: String,
      state: String,
      country: String,
      neighborhood: String,
      latitude: Number,
      longitude: Number,
      number: Number,
      complement: String,
      zip_code: String,
    }
  },
  items: {
    type: Array,
    schema: [
      {
        type: Object,
        schema: {
          sku: String,
          name: String,
          quantity: Number,
          unit_price: Number,
          options: {
            type: Array,
            schema: [{
              type: Object,
              schema: {
                name: String,
                option_items: {
                  type: Array,
                  schema: [{
                    type: Object,
                    schema: {
                      name: String,
                      quantity: Number,
                      unit_price: Number,
                    }
                  }]
                }
              }
            }]
          },
        }
      }
    ]
  },
  status: {
    type: String,
    default: DeliveryStatusEnum.NEW_ORDER
  },
}, {
  timestamps: true
});

export const ordersModel: DocumentModelType<Orders> = dynamoose.model<DocumentModelType<Orders>>(process.env.ORDERS_TABLE, ordersSchema);