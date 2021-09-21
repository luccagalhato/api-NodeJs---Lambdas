import * as dynamoose from 'dynamoose';
import { DocumentModelType } from '../@types';
import { Collaborator } from '../interfaces';
import { v4 as uuidv4 } from 'uuid';

const collaboratorsSchema = new dynamoose.Schema({
  id: {
    type: String,
    default: uuidv4
  },
  geoKey: {
    type: Number,
    hashKey: true,
  },
  rangeKey: {
    type: String,
    rangeKey: true
  },
  first_name: String,
  last_name: String,
  geoJson: String,
  geoHash: Number,
  latitude: Number,
  contact: {
    type: Object,
    schema: {
      email: String,
      phone: String
    }
  },
  longitude: Number,
  is_available: Boolean,
  is_online: Boolean,
  radius: Number,
  expo_device_token: String,
}, {
  timestamps: true
});

export const collaboratorsModel: DocumentModelType<Collaborator> = dynamoose.model<DocumentModelType<Collaborator>>(process.env.COLLABORATORS_TABLE, collaboratorsSchema);