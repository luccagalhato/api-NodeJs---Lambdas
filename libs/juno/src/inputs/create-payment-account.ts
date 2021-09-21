import { Address, BankAccount, LegalRepresentative } from '../entities';
import { JunoEntity } from '../entities/entity';
import { CompanyType } from '../enums';

type AddressInput = Omit<Address, keyof JunoEntity>;
type BankAccountInput = Omit<BankAccount, keyof JunoEntity>;
type LegalRepresentativeInput = Omit<LegalRepresentative, keyof JunoEntity>;

export interface CreatePaymentAccountInput {
  type: 'PAYMENT';
  name: string;
  document: string;
  email: string;
  birthDate?: string;
  phone: string;
  businessArea: number;
  linesOfBusiness: string;
  companyType?: CompanyType;
  legalRepresentative?: LegalRepresentativeInput;
  address: AddressInput;
  bankAccount: BankAccountInput;
  emailOptOut?: boolean;
  autoTransfer?: boolean;
  socialName?: boolean;
  monthlyIncomeOrRevenue?: number;
  cnae?: string;
  establishmentDate?: string;
  pep?: boolean;
  companyMembers?: {
    name: string;
    document: string;
    birthDate: string;
  }[];
}
