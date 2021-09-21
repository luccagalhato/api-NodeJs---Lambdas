import { TransferStatusDefaultBankAccount, TransferStatusP2P } from '../enums';
import { JunoEntity } from './entity';

export interface Transfer extends JunoEntity {
  creationDate: string;
  amount: number;
  status: TransferStatusDefaultBankAccount | TransferStatusP2P;
  digitalAccountId: string;
  recipient: {
    document: string;
  };
}
