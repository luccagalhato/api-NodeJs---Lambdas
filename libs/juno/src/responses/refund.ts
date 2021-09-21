import { JunoEntity } from '../entities/entity';
import { Refund } from '../entities/refund';

export interface RefundPaymentResponse extends JunoEntity {
  transactionId: string;
  installments: number;
  refunds: Array<Refund>;
}
