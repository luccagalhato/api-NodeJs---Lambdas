import { Context, Handler } from "aws-lambda";
import { ElasticClient } from "./services/elastic/client";
import { stringifyJSON, transformToProduct } from "./utils";

const index = "product";
const type = "products";

export const handler: Handler = async (event: any, context: Context) => {
  console.log(stringifyJSON({ event, context }));

  const client = ElasticClient(index, type);

  for (const record of event.Records) {
    try {
      const {
        dynamodb: { Keys, NewImage },
      } = record;

      const sku = Keys.sku.S;
      const body = transformToProduct(NewImage);
      console.log(sku, body, NewImage);

      let result: any;

      if (record.eventName === "INSERT") result = await client.Index(sku, body);
      if (record.eventName === "MODIFY") result = await client.Index(sku, body);
      if (record.eventName === "REMOVE") result = await client.Delete(sku);

      console.log(stringifyJSON(result));
    } catch (error) {
      console.error(stringifyJSON(error));
    }
  }
};
