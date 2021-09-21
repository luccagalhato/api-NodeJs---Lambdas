import { Transfer } from '../entities';
import { TransferTypes } from '../enums';
import { JunoParamsMissingError } from '../errors';
import { CreateTransferDefaultBankInput, CreateTransferInput } from '../inputs';
import { Resource } from './resource';

export class TransfersResource extends Resource {
  public endpoint(): string {
    return 'transfers';
  }

  /**
   * Requests a Transfer
   * @param token User token
   * @param requestTransferInput
   */
  public createTransfer(formParams: CreateTransferInput) {
    const { token, ...payload } = formParams as CreateTransferDefaultBankInput;
    if (!token && payload.type === TransferTypes.DEFAULT_BANK_ACCOUNT) {
      throw new JunoParamsMissingError("token wasn't provided.");
    }
    return this.create<Transfer>(formParams, token);
  }
}
