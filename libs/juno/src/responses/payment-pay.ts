import { Payment } from '../entities';
import { JunoEntity } from '../entities/entity';

export interface PaymentPayResponse extends JunoEntity {
  transactionId: string;
  installments: number;
  payments: Array<Payment>;
}

export interface CapturePaymentResponse extends JunoEntity {
  transactionId: string;
  installments: number;
  payments: Array<Payment>;
}

