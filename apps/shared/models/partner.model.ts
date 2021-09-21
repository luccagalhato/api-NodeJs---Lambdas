import * as dynamoose from "dynamoose";
import { DocumentModelType } from "../@types";
import { Partners } from "../interfaces";
import { v4 as uuidv4 } from "uuid";

const partnerSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
    },
    is_online: Boolean,
    email: String,
    name: String,
    categories: {
      type: Array,
      schema: [String],
    },
    tags: {
      type: Array,
      schema: [String],
    },
    radius: Number,
    logo_url: String,
    banner_url: String,
    description: String,
    status: String,
    open_time: Date,
    end_time: Date,
    location: {
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
      },
    },
    contact: {
      type: Object,
      schema: {
        email: String,
        cellphone: String,
        telephone: String,
      },
    },
    expo_device_token: String,
    payment_info: {
      type: Object,
      schema: {
        token_id: String,
        webhook: {
          type: Object,
          schema: {
            id: String,
            url: String,
            secret: String,
            status: String,
          },
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

export const partnerModel: DocumentModelType<Partners> = dynamoose.model<
  DocumentModelType<Partners>
>(process.env.PARTNERS_TABLE, partnerSchema);
