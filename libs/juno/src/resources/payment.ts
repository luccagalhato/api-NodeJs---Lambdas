import { CapturePaymentInput, PaymentInput } from '../inputs';
import { RefundInput } from '../inputs/refund';
import {
  CapturePaymentResponse,
  PaymentPayResponse,
  RefundPaymentResponse,
} from '../responses';
import { Resource } from './resource';

export class PaymentResource extends Resource {
  public endpoint(): string {
    return 'payments';
  }

  public createPayment(formParams: PaymentInput) {
    return this.create<PaymentPayResponse>(formParams);
  }

  public capture(id: string, formParams: Partial<CapturePaymentInput>, token?: string) {
    return this.post<CapturePaymentResponse>(id, 'capture', formParams, token);
  }

  public refunds(id: string, formParams: Partial<RefundInput>, token?: string) {
    return this.post<RefundPaymentResponse>(id, 'refunds', formParams, token);
  }
}
