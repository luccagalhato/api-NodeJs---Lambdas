import { JunoEntity } from './entity';
import { BilletDetails } from './billet-details';
import { Payment } from './payment';

export interface Charge extends JunoEntity {
  code: number;
  reference: string;
  dueDate: string | Date;
  link: string;
  checkoutUrl: string;
  installmentLink: string;
  payNumber: string;
  amount: number;
  billetDetails: BilletDetails;
  payments: Payment[];
}