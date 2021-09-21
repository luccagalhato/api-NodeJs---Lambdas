import { Context, Handler } from "aws-lambda";
import { ElasticClient } from "./services/elastic/client";
import { stringifyJSON, transformToCategory } from "./utils";

const index = "category";
const type = "categories";

export const handler: Handler = async (event: any, context: Context) => {
  console.log(stringifyJSON({ event, context }));

  const client = ElasticClient(index, type);

  for (const record of event.Records) {
    try {
      const {
        dynamodb: { Keys, NewImage }
      } = record;

      const id = Keys.id.S;
      const body = transformToCategory(NewImage);
      console.log(id, body, NewImage);

      let result: any;

      if (record.eventName === "INSERT") result = await client.Index(id, body);
      if (record.eventName === "MODIFY") result = await client.Index(id, body);
      if (record.eventName === "REMOVE") result = await client.Delete(id);

      console.log(stringifyJSON(result));
    } catch (error) {
      console.error(stringifyJSON(error));
    }
  }
};
