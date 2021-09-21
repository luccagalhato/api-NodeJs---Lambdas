import { EventTypesName } from '../enums';

export interface CreateWebhookInput {
  url: string;
  eventTypes: EventTypesName[];
  token?: string;
}
