import * as AWS from "aws-sdk";
import * as ddbGeo from "dynamodb-geo";

AWS.config.update({
  accessKeyId: process.env.DEFAULT_ACCESS_KEY,
  secretAccessKey: process.env.DEFAULT_SECRET,
  region: process.env.REGION,
});

// const ddb = new AWS.DynamoDB();

// const configDdbGeo = new ddbGeo.GeoDataManagerConfiguration(ddb, 'collaborators');
// configDdbGeo.hashKeyLength = 5;

// export const geoCollaboratorsManager = new ddbGeo.GeoDataManager(configDdbGeo);

// const createTableInput = ddbGeo.GeoTableUtil.getCreateTableRequest(configDdbGeo);
// createTableInput.ProvisionedThroughput.ReadCapacityUnits = 5
// ddb.describeTable({ TableName: 'collaborators' }, function (err, data) {
//   if (err) ddb.createTable(createTableInput).promise()
//     .then(() => console.log('Inital Collaborators Created'))
// });
