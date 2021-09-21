import {
  GetChargeByIdResponse,
  GetChargesInput,
  GetChargesResponse,
  CreateChargesResponse,
} from '../responses';
import { CreateChargeInput, UpdateChargeSplitInput } from '../inputs';
import { Resource } from './resource';

export class ChargeResource extends Resource {
  public endpoint(): string {
    return 'charges';
  }

  public getCharges(filter?: GetChargesInput, token?: string) {
    return this.allByQuery<GetChargesResponse>(filter, token);
  }

  public getChargeById(id: string, token?: string) {
    return this.getById<GetChargeByIdResponse>(token, id);
  }

  public createCharge(formParams: CreateChargeInput, token?: string) {
    return this.create<CreateChargesResponse>(formParams, token);
  }

  public cancelCharge(id: string, token?: string) {
    return this.update<void>(undefined, token, id, 'cancelation');
  }

  public updateChargeSplit(
    id: string,
    formParams: Partial<UpdateChargeSplitInput>,
    token?: string,
  ) {
    return this.updateSome<void>(formParams, token, id, 'split');
  }
}
