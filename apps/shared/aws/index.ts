import * as AWS from 'aws-sdk'

export const convertDynamoDataToObject = (data: AWS.DynamoDB.AttributeMap) => {
  return AWS.DynamoDB.Converter.unmarshall(data)
}

export const getAWSSecret = async (secretArn: string) => {
  const client = new AWS.SecretsManager({ region: process.env.REGION });

  return new Promise((resolve, reject) => {
    client.getSecretValue({ SecretId: secretArn }, function (err, data) {
      if (err) {
        reject(err);
      }
      else {
        if ('SecretString' in data) {
          resolve(JSON.parse(data.SecretString));
        } else {
          const buff = Buffer.from((data.SecretBinary as string), 'base64').toString('ascii');
          resolve(buff);
        }
      }
    });
  });
}