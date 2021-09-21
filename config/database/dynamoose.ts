import * as dynamoose from "dynamoose";

const ddb = new dynamoose.aws.sdk.DynamoDB({
  accessKeyId: process.env.DEFAULT_ACCESS_KEY,
  secretAccessKey: process.env.DEFAULT_SECRET,
  region: process.env.REGION,
});

dynamoose.aws.ddb.set(ddb);
