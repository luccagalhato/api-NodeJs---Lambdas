import AWS from 'aws-sdk';

export default function ConfigDynamoDbLocal() :any{

  const dynamodbOfflineOptions = {
    region: "localhost",
    endpoint: "http://localhost:8000",
    accessKeyId: process.env.DEFAULT_ACCESS_KEY,
    secretAccessKey: process.env.DEFAULT_SECRET
  }
  
  const isOffline = () => process.env.IS_OFFLINE;
  
  const client = isOffline()
  ? new AWS.DynamoDB.DocumentClient(dynamodbOfflineOptions)
  : new AWS.DynamoDB.DocumentClient();


  return client
  
  };




