import * as AWS from "aws-sdk";
import * as ddbGeo from "dynamodb-geo";

AWS.config.update({
  accessKeyId: process.env.DEFAULT_ACCESS_KEY,
  secretAccessKey: process.env.DEFAULT_SECRET,
  region: process.env.REGION,
});

const ddb = new AWS.DynamoDB();

const DDB_TABLENAME = process.env.COLLABORATORS_TABLE;
const config = new ddbGeo.GeoDataManagerConfiguration(ddb, DDB_TABLENAME);
config.hashKeyLength = 5;
config.hashKeyAttributeName = "geoKey";
config.longitudeFirst = false;

const createTableInput = ddbGeo.GeoTableUtil.getCreateTableRequest(config);

// Check if table exists - if not create on with geolocations params
ddb.describeTable({ TableName: DDB_TABLENAME }, (err) => {
  if (err) {
    return ddb
      .createTable(createTableInput)
      .promise()
      .then(
        async () =>
          await ddb
            .waitFor("tableExists", { TableName: config.tableName })
            .promise()
      );
  }
});

// Export Geo Table Manager
// Using this manager to manipulate geo locations data
export const collaboratorGeoTableManager = new ddbGeo.GeoDataManager(config);
