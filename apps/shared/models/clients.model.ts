import * as dynamoose from 'dynamoose';
import { DocumentModelType } from '../@types';
import { Clients } from '../interfaces/clients.interface';
import { v4 as uuidv4 } from 'uuid';

const ClientsSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
    },
    cognitoIndentity: String,
    payments_cards: {
      type: Array,
      schema: [
        {
          type: Object,
          schema: {
            internalId: String,
            paymentGatewayId: String,
            last4CardNumber: String,
            expirationMonth: String,
            expirationYear: String,
          },
        },
      ],
    },
    delivery_address: {
      type: Array,
      schema: [
        {
          type: Object,
          schema: {
            place_id: String,
            surname: String,
            street: String,
            number: Number,
            postal_code: String,
            neighborhood: String,
            state: String,
            city: String,
            country: String,
            complement: String,
            reference_point: String,
            latitude: Number,
            longitude: Number,
          },
        },
      ],
    },
    default_place_id: String,

    phone_number: String,
    email: String,
    cpf: String,
    first_name: String,
    last_name: String,
    expo_device_token: String,
  },
  {
    timestamps: true,
  },
);

export const clientsModel: DocumentModelType<Clients> = dynamoose.model<
  DocumentModelType<Clients>
>(process.env.CLIENTS_TABLE, ClientsSchema);
