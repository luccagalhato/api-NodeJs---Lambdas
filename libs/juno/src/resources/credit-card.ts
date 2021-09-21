import { CredTokenInput } from '../inputs';
import { CardTokenResponse } from '../responses';
import { Resource } from './resource';

export class CreditCardResource extends Resource {
  public endpoint(): string {
    return 'credit-cards/tokenization';
  }

  public tokenizeCard(formParams: CredTokenInput) {
    return this.create<CardTokenResponse>(formParams);
  }
}
