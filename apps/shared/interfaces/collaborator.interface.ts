import { PartnerPaymentInfo } from "./payment.interface";

export interface Collaborator extends Document {
  id?: string,
  geoKey?: number,
  rangeKey?: string,
  geoJson: string,
  geoHash: number,
  first_name: string,
  last_name: string,
  latitude?: number,
  longitude?: number,
  is_available: boolean,
  is_online: boolean,
  radius: number,
  contact: {
    email: string,
    phone: string
  },
  paymentInfo?: PartnerPaymentInfo;
  expo_device_token?: String;
}