import {
  AddressInput,
  CapturePaymentInput,
  ChargeSplitInput,
  CreditCardDetails,
  PaymentInput,
  RefundInput,
} from '../../../libs/juno/src/inputs';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
} from 'class-validator';

class Billing {
  @IsEmail()
  email: string;
  @IsNotEmptyObject(
    { nullable: false },
    { message: 'O endereço é obrigatório' },
  )
  address: AddressInput;
  @IsBoolean({
    message:
      'Você deve informar true ou false para pagamentos do tipo CREDIT_CARD',
  })
  delayed: boolean;
}

export class PaymentDTO implements PaymentInput {
  @IsNotEmpty({ message: 'É necessário informar o id da cobrança a ser paga' })
  chargeId: string;
  billing: Billing;
  creditCardDetails: CreditCardDetails;
}

export class RefundDTO implements Partial<RefundInput> {
  amount?: number;
  split?: ChargeSplitInput[];
}

export class CapturePaymentDTO implements Partial<CapturePaymentInput> {
  chargeId?: string;
  amount?: number;
}
