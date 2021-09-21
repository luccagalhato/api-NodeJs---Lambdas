import * as AWS from "aws-sdk";
import { Client } from "elasticsearch";
import Delete from "./delete";
import Index from "./index";
import Search from "./search";

const params = {
  host: process.env.AWS_ES_HOST,
  log: "error",
  apiVersion: "7.x"
};

export function ElasticClient(index: string, type: string) {
  const client = new Client({ ...params });
  return operations(client, index, type);
}

export function ElasticClientWithCredentials(index: string, type: string) {
  const awsConfig = new AWS.Config({
    region: process.env.REGION,
    credentials: new AWS.Credentials({
      accessKeyId: process.env.DEFAULT_ACCESS_KEY,
      secretAccessKey: process.env.DEFAULT_SECRET
    })
  });

  const paramsWithCredentials = {
    ...params,
    awsConfig
  };

  const client = new Client({ ...paramsWithCredentials });
  return operations(client, index, type);
}

function operations(client: Client, index: string, type: string) {
  return {
    Instance: client,
    Delete: Delete(client, index, type),
    Index: Index(client, index, type),
    Search: Search(client, index, type)
  };
}
