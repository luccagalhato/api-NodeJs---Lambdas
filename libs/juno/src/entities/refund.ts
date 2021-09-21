import { JunoEntity } from './entity';

export interface Refund extends JunoEntity {
  chargeId: string;
  releaseDate: Date;
  paybackDate: Date;
  paybackAmount: number;
  status: string;
}
