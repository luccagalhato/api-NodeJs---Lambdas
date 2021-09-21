import { TransferTypes, AccountComplementNumber, AccountType } from '../enums';

export interface BankAccountInfo {
  ispb?: string;
  bankNumber: string;
  agencyNumber: string;
  accountNumber: string;
  accountComplementNumber?: AccountComplementNumber;
  accountType: AccountType;
}

export interface CreateTransferDefaultBankInput {
  token?: string;
  type: TransferTypes.DEFAULT_BANK_ACCOUNT;
  amount: number;
}

export interface CreateTransferP2PInput {
  type: TransferTypes.P2P;
  name: string;
  document: string;
  amount: number;
  bankAccount?: Partial<BankAccountInfo>;
}

export interface CreateTransferBankInput {
  type: TransferTypes.BANK_ACCOUNT;
  name: string;
  document: string;
  amount: number;
  bankAccount: BankAccountInfo;
}

export interface CreateTransferPixInput {
  type: TransferTypes.PIX;
  name: string;
  document: string;
  amount: number;
  bankAccount: BankAccountInfo;
}

export type CreateTransferInput =
  | CreateTransferDefaultBankInput
  | CreateTransferBankInput
  | CreateTransferPixInput
  | CreateTransferP2PInput;
