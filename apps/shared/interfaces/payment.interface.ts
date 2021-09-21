import { CardHashResponse } from "../../../libs/juno/src/responses";
import { PaymentWebhookEnum } from "../enums";

export interface CreateCharge {
  billing: PaymentBilling;
  charge: PaymentCharge;
}

export interface CCPayment {
  chargeId: string;
  billing: {
    email: string;
    address: PaymentAddress;
    delayed?: boolean;
  };
  creditCardDetails: {
    creditCardId: string;
  };
}

export interface PaymentCharge {
  pixKey?: string;
  description: string;
  references?: [string];
  totalAmount?: number;
  amount: number;
  dueDate?: Date;
  installments?: number;
  maxOverdueDays?: number;
  fine?: number;
  interest?: number;
  discountAmount?: number;
  discountDays?: number;
  paymentTypes: "BOLETO" | "BOLETO_PIX" | "CREDIT_CARD";
  paymentAdvance?: boolean;
  feeSchemaToken?: string;
  split?: [SplitPayment];
}

export interface PaymentBilling {
  name: string;
  document: string;
  email: string;
  address: PaymentAddress;
  secondaryEmail?: string;
  phone?: string;
  birthDate?: Date;
  notify?: boolean;
}

export interface SplitPayment {
  recipientToken: string;
  amount: number;
  percentage: number;
  amountRemainder: boolean;
  chargeFee: boolean;
}

export interface PaymentAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood?: string;
  city: string;
  state: string;
  postCode: string;
}

export interface CCTokenResponse {
  creditCardId: string;
  last4CardNumber: string;
  expirationMonth: string;
  expirationYear: string;
}

export interface ClientAddPaymentData {
  cardHash: string;
  holderName: string;
  holderDocument: string;
}

export interface OAuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  user_name: string;
  jti: string;
}

export interface AuthorizationData {
  token: string;
  expiresIn: number;
}

export interface JunoServiceArgs extends AuthorizationData {
  AUTH_URL?: string;
  RESOURCE_URL?: string;
  PUBLIC_TOKEN?: string;
  PRIVATE_TOKEN?: string;
  CLIENT_ID?: string;
  CLIENT_SECRET?: string;
  X_IDEMPOTENCY_KEY?: string;
}

export interface ChargeError {
  timestamp: string;
  status: number;
  error: string;
  path: string;
  details: {
    field: string;
    message: string;
    erroCode: string;
  };
}

export interface PartnerPaymentInfo {
  tokenID: string;
  webhooks?: [
    {
      id: string;
      url: string;
      secret: string;
      status: "ACTIVE" | "INACTIVE";
      eventTypes: [
        {
          id: string;
          name: PaymentWebhookEnum;
          label: string;
          status: "ENABLED" | "DEPRECATED";
          links: [
            {
              self: {
                href: string;
              };
            }
          ];
        }
      ];
    }
  ];
}

export interface TokenizationCardData {
  id: string;
  cardHash: string;
  accessToken: string;
  idToken: string;
}
