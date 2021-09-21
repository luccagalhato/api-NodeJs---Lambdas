import { EventType } from './event-type';
import { WebhookStatus } from '../enums';
import { JunoEntity } from './entity';

export interface Webhook extends JunoEntity {
  url: string;
  secret: string;
  status: WebhookStatus;
  eventTypes: EventType[];
}