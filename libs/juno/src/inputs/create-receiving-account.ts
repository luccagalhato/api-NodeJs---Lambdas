import { Address, BankAccount, LegalRepresentative } from '../entities';
import { JunoEntity } from '../entities/entity';
import { CompanyType } from '../enums';

type AddressInput = Omit<Address, keyof JunoEntity>;
type BankAccountInput = Omit<BankAccount, keyof JunoEntity>;
type LegalRepresentativeInput = Omit<LegalRepresentative, keyof JunoEntity>;

export interface CreateReceivingAccountInput {
  companyType: CompanyType;
  name: string;
  document: string;
  email: string;
  phone: string;
  businessArea: number;
  tradingName: string;
  birthDate: string;
  address: AddressInput;
  bankAccount: BankAccountInput;
  legalRepresentative: LegalRepresentativeInput;
  type: 'RECEIVING';
  businessUrl: string;
}
