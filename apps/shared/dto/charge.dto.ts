import { GetChargesInputOrderBy } from '../../../libs/juno/src/enums';
import {
  AddressInput,
  ChargeSplitInput,
  CreateChargeInput,
  UpdateChargeSplitInput,
} from '../../../libs/juno/src/inputs';
import { GetChargesInput } from '../../../libs/juno/src/responses';
import { ArrayNotEmpty, IsNotEmpty, IsNotEmptyObject } from 'class-validator';

class ChagrgeValues {
  pixKey?: string;
  @IsNotEmpty({ message: 'A descrição da cobrança é obrigatória' })
  description: string;
  references?: Array<string>;
  totalAmount?: number;
  @IsNotEmpty({ message: 'O valor da cobrança é obrigatório' })
  amount: number;
  dueData?: Date;
  installments?: number;
  maxOverDueDays?: number;
  fine?: number;
  interest?: number;
  discountAmount?: 0;
  discountDays?: number;
  @ArrayNotEmpty({
    message: 'O tipo CREDIT_CARD é obrigatório para Checkout Transparent',
  })
  paymentTypes: Array<string>;
  paymentAdvance?: boolean;
  feeSchemaToken?: string;
  split?: Array<ChargeSplitInput>;
}

class BillingValues {
  @IsNotEmpty({ message: 'O nome do comprador é obrigatório' })
  name: string;
  @IsNotEmpty({ message: 'O CPF ou CNPJ do comprador é obrigatório' })
  document: string;
  @IsNotEmpty({ message: 'O email do comprador é obrigatório' })
  email: string;
  @IsNotEmptyObject(
    { nullable: false },
    {
      message:
        'Os elementos `street`, `number`, `city`, `state`, `postCode` são obrigatórios',
    },
  )
  address: AddressInput;
  secondaryEmail?: string;
  phone?: string;
  birthDate?: Date;
  notify?: boolean;
}

export class ChargeDTO implements CreateChargeInput {
  @IsNotEmptyObject(
    { nullable: false },
    { message: 'O objeto `charge` é obrigatório' },
  )
  charge: ChagrgeValues;
  @IsNotEmptyObject(
    { nullable: false },
    { message: 'O objeto `charge` é obrigatório' },
  )
  billing: BillingValues;
}

export class FiltersChargeDTO implements GetChargesInput {
  createdOnStart?: string | Date;
  createdOnEnd?: string | Date;
  dueDateStart?: string | Date;
  dueDateEnd?: string | Date;
  paymentDateStart?: string | Date;
  paymentDateEnd?: string | Date;
  showUnarchived?: boolean;
  showArchived?: boolean;
  showDue?: boolean;
  showNotDue?: boolean;
  showPaid?: boolean;
  showNotPaid?: boolean;
  showCancelled?: boolean;
  showNotCancelled?: boolean;
  showManualReconciliation?: boolean;
  showNotManualReconciliation?: boolean;
  showNotFailed?: boolean;
  orderBy?: GetChargesInputOrderBy;
  orderAsc?: boolean;
  pageSize?: number;
  page?: number;
  firstObjectId?: string;
  firstValue?: string;
  lastObjectId?: string;
  lastValue?: string;
}

export class UpdateChargeSplitDTO implements Partial<UpdateChargeSplitInput> {
  split?: Array<ChargeSplitInput>;
}
