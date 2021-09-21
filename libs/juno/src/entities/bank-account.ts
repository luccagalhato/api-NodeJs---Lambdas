import { AccountHolder } from './account-holder';
import { JunoEntity } from './entity';

export interface BankAccount extends JunoEntity {
  accountComplementNumber: string;
  accountNumber: string;
  accountType: string;
  agencyNumber: string;
  bankNumber: string;
  accountHolder?: AccountHolder;
}