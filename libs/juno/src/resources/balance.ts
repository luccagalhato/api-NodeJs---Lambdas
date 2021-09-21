import { Resource } from './resource';
import { Balance } from '../entities';

export class BalanceResource extends Resource {
  public endpoint(): string {
    return 'balance';
  }

  public getBalance(token: string) {
    return this.get<Balance>(token);
  }
}
