import { EventTypesName, WebhookStatus } from '../../../libs/juno/src/enums';
import {
  CreateWebhookInput,
  DeleteWebhookInput,
  UpdateWebhookInput,
} from '../../../libs/juno/src/inputs';
import { ArrayNotEmpty, IsNotEmpty } from 'class-validator';

export class CreateWebhookDTO implements CreateWebhookInput {
  @IsNotEmpty({ message: 'O campo url é obrigatório' })
  url: string;
  @ArrayNotEmpty({
    message: 'Deve ser informado pelo menos um event type',
  })
  eventTypes: EventTypesName[];
  token?: string;
}

export class UpdateWebhookDTO implements Omit<UpdateWebhookInput, 'id'> {
  @IsNotEmpty({ message: 'O campo status é obrigatório' })
  status: WebhookStatus;
  @ArrayNotEmpty({
    message: 'Deve ser informado pelo menos um event type',
  })
  eventTypes: EventTypesName[];
  token?: string;
}

export class DeleteWebhookDTO implements Omit<DeleteWebhookInput, 'id'> {
  token?: string;
}
