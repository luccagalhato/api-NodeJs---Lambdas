import * as dynamoose from 'dynamoose';
import { DocumentModelType } from '../@types';
import { ServerConfigs } from '../interfaces/serverConfigs.interface';

const ServerConfigSchema = new dynamoose.Schema(
  {
    gatewayToken: String,
    deliveryBasePrice: Number,
  },
  {
    timestamps: false,
  },
);

export const serverConfigModel: DocumentModelType<ServerConfigs> = dynamoose.model<
  DocumentModelType<ServerConfigs>
>('ServerConfigs', ServerConfigSchema);
