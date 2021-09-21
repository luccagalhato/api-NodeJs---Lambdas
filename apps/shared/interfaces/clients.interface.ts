export interface Clients extends Document {
  id: string;
  // favorite_cateories: [{ id: string }];
  delivery_address: Array<DeliveryAddress>;
  // status: string,
  // token_payment: string,
  email: string;
  phone_number: string;
  cpf: string;
  first_name: string;
  last_name: string;
  payments_cards: Array<CreditCard>;
  cognitoIndentity: string;
  default_place_id?: string;
  expo_device_token?: String;
}

export interface DeliveryAddress {
  place_id?: string;
  surname?: string;
  street?: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  number?: number;
  complement?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  reference_point?: string;
}

export interface CreditCard{
  internalId: string;
  paymentGatewayId: string;
  last4CardNumber: string;
  expirationMonth: string;
  expirationYear: string;
}
