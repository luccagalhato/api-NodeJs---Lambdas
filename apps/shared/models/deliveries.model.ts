import * as dynamoose from 'dynamoose';
import { DocumentModelType } from '../@types';
import { Deliveries } from '../interfaces/deliveries.interface';
import { v4 as uuidv4 } from 'uuid';

const deliveriesSchema = new dynamoose.Schema({
  id: {
    type: String,
    default: uuidv4(),
    hashKey: true
  },
  order_info: {
    type: Object,
    schema: {
      order_id: String,
      partner_id: String,
      partnerLatitude: Number,
      partnerLongitude: Number,
      clientLatitude: Number,
      clientLongitude: Number,
    }
  },
  collaborator_id: String,
  collaborator_status: String,
  status: String,
  track_events: {
    type: Array,
    schema: [
      {
        type: Object,
        schema: {
          id: {
            type: String,
            default: uuidv4
          },
          event: String,
          latitude: Number,
          longitude: Number,
          description: String,
          created_at: String
        }
      }
    ]
  },
}, {
  timestamps: true
});

export const deliveriesModel: DocumentModelType<Deliveries> = dynamoose.model<DocumentModelType<Deliveries>>(process.env.DELIVERIES_TABLE, deliveriesSchema);