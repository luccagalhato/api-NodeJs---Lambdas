import { JunoEntity } from './entity';

export interface BilletDetails extends JunoEntity{
  bankAccount: string;
  ourNumber: string;
  barcodeNumber: string;
  portfolio: string;
}