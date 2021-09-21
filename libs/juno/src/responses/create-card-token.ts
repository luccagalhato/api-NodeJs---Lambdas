export interface CardTokenResponse {
  creditCardId: string;
  last4CardNumber: string;
  expirationMonth: string;
  expirationYear: string;
}

export interface CardHashResponse {
  data: string;
  success: boolean;
}
