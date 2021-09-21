import { ChargeSplitInput } from './create-charge';

export interface RefundInput {
  amount: number;
  split: Array<ChargeSplitInput>;
}
