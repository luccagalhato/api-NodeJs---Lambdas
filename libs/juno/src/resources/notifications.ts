import { Resource } from './resource';
import { GetListResponse } from '../responses';
import { EventType, Webhook } from '../entities';
import {
  CreateWebhookInput,
  DeleteWebhookInput,
  UpdateWebhookInput,
} from '../inputs';

export class NotificationsResource extends Resource {
  public endpoint(): string {
    return 'notifications';
  }

  public getWebhooks(token?: string) {
    return this.get<GetListResponse<{ webhooks: Webhook[] }>>(
      token,
      'webhooks',
    );
  }

  public getWebhookById(id: string, token?: string) {
    return this.getById<NotificationsResource>(token, 'webhooks', id);
  }

  public createWebhook({ token = undefined, ...payload }: CreateWebhookInput) {
    return this.post<Webhook>('webhooks', undefined, payload, token);
  }

  public updateWebhook({ token, id, ...payload }: UpdateWebhookInput) {
    return this.updateSome<Webhook>(payload, token, 'webhooks', id);
  }

  public removeWebhook({ token, id }: DeleteWebhookInput) {
    return this.delete<void>('webhooks', id, undefined, token);
  }

  public getEventTypes(token?: string) {
    return this.get<GetListResponse<{ eventTypes: EventType[] }>>(
      token,
      'event-types',
    );
  }
}
