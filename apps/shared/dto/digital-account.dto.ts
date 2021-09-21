import { CompanyType } from '../../../libs/juno/src/enums';
import {
  AddressInput,
  BankAccountInput,
  CreatePaymentAccountInput,
  LegalRepresentativeInput,
  UpdateDigitalAccountInput,
} from '../../../libs/juno/src/inputs';

export class CreateDigitalAccountDTO implements CreatePaymentAccountInput {
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
  emailOptOut?: boolean = false;
  autoTransfer?: boolean = false;
  socialName?: boolean = false;
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

export class UpdateDigitalAccountDTO implements UpdateDigitalAccountInput {
  companyType?: CompanyType;
  name?: string;
  birthDate?: string;
  linesOfBusiness?: string;
  email?: string;
  phone?: string;
  businessArea?: number;
  tradingName?: string;
  address?: AddressInput;
  bankAccount?: BankAccountInput;
  legalRepresentative?: LegalRepresentativeInput;
}
