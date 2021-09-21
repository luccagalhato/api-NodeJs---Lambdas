import { Address } from '../entities';
import { JunoEntity } from '../entities/entity';

type AddressInput = Omit<Address, keyof JunoEntity>;

export interface PaymentBillingInput {
  email: string;
  address: AddressInput;
  delayed: boolean;
}

export type CreditCardDetails =
  | {
      creditCardId: string;
    }
  | {
      creditCardHash: string;
    };

export interface PaymentInput {
  chargeId: string;
  billing: PaymentBillingInput;
  creditCardDetails: CreditCardDetails;
}

export interface CapturePaymentInput {
  chargeId: string;
  amount: number;
}
