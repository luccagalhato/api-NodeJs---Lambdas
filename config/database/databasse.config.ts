import * as dynamoose from "dynamoose";
import { DynamoDB } from "dynamoose/dist/aws/sdk";

export const ddb: DynamoDB = new dynamoose.aws.sdk.DynamoDB({
  accessKeyId: process.env.DEFAULT_ACCESS_KEY,
  secretAccessKey: process.env.DEFAULT_SECRET,
  region: process.env.REGION,
});
export default dynamoose.aws.ddb.set(ddb);
