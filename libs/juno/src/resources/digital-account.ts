import {
  CreatePaymentAccountInput,
  CreateReceivingAccountInput,
  UpdateDigitalAccountInput,
} from '../inputs';
import {
  CreateDigitalAccountResponse,
  GetDigitalAccountResponse,
  UpdateDigitalAccountResponse,
} from '../responses';
import { Resource } from './resource';

export class DigitalAccountResource extends Resource {
  public endpoint(): string {
    return 'digital-accounts';
  }

  public createDigitalAccount(
    formParams: CreatePaymentAccountInput | CreateReceivingAccountInput,
    token?: string,
  ) {
    return this.create<CreateDigitalAccountResponse>(formParams, token);
  }

  public retrieveDigitalAccount(token?: string) {
    return this.get<GetDigitalAccountResponse>(token);
  }

  public updateDigitalAccount(
    formParams: UpdateDigitalAccountInput,
    token?: string,
  ) {
    return this.updateSome<UpdateDigitalAccountResponse>(formParams, token);
  }
}
