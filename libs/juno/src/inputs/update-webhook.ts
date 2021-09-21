import { EventTypesName, WebhookStatus } from '../enums';

export interface UpdateWebhookInput {
  id: string;
  token?: string;
  status: WebhookStatus;
  eventTypes: EventTypesName[];
}
