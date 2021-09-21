import * as dynamoose from "dynamoose";
import { DocumentModelType } from "../@types";
import { v4 as uuidv4 } from "uuid";
import { Catalog } from "../interfaces";

const catalogSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
    },
    name: String,
    partner_id: String,
    section_id: Number,
    categories: {
      type: Array,
      schema: [String],
    },
    items: {
      type: Array,
      schema: [String],
    },
  },
  {
    timestamps: true,
  }
);

export const catalogModel: DocumentModelType<Catalog> = dynamoose.model<
  DocumentModelType<Catalog>
>(process.env.CATALOG_TABLE, catalogSchema);
