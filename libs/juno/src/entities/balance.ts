import { JunoEntity } from './entity';

export interface Balance extends JunoEntity {
  balance: number;
  withheldBalance: number;
  transferableBalance: number;
}