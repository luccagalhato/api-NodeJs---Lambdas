import * as dynamoose from 'dynamoose';
import { DocumentModelType } from '../@types';
import { Products } from '../interfaces';
import { v4 as uuidv4 } from 'uuid';

const productsSchema = new dynamoose.Schema({
  "sku": {
    "type": String,
    "default": uuidv4
  },
  "items": {
    "type": Array,
    "schema": [String]
  },
  "options": {
    "type": Array,
    "schema": [{
      "type": Object,
      "schema": {
        "max_count": Number,
        "min_count": Number,
        "max_unique": Number,
        "section_name": String,
        "section_id": Number,
        "option_items": {
          "type": Array,
          "schema": [{
              "type": Object,
              "schema": {
                "price": Number,
                "option_name": String,
                "is_available": Boolean,
                "tags": {
                  "type": Array,
                  "schema": [String]
                }
              }
          }]
        }
      }
    }]
  },
  "name": String,
  "price": Number,
  "visible": Boolean,
  "image_url": String,
  "description": String,
  "partner_id": String,
  "tags": {
    "type": Array,
    "schema": [String]
  },
}, {
  "timestamps": true
});

export const productsModel: DocumentModelType<Products> = dynamoose.model<DocumentModelType<Products>>(process.env.PRODUCTS_TABLE, productsSchema);