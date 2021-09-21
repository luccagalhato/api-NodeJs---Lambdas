import { TransferTypes } from '../../../libs/juno/src/enums';
import {
  CreateTransferBankInput,
  CreateTransferDefaultBankInput,
  CreateTransferP2PInput,
  BankAccountInfo,
  CreateTransferPixInput,
} from '../../../libs/juno/src/inputs';

export class TransferP2PDTO implements CreateTransferP2PInput {
  token?: string;
  type: TransferTypes.P2P;
  amount: number;
  name: string;
  document: string;
  bankAccount?: {
    accountNumber: string;
  };
}

export class TransferDefaultBankDTO implements CreateTransferDefaultBankInput {
  token?: string;
  type: TransferTypes.DEFAULT_BANK_ACCOUNT;
  amount: number;
}

export class TransferBankAccountDTO implements CreateTransferBankInput {
  token?: string;
  type: TransferTypes.BANK_ACCOUNT;
  amount: number;
  name: string;
  document: string;
  bankAccount: BankAccountInfo;
}

export class TransferPixDTO implements CreateTransferPixInput {
  token?: string;
  type: TransferTypes.PIX;
  name: string;
  document: string;
  amount: number;
  bankAccount: BankAccountInfo;
}
