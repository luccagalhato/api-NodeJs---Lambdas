export interface Partners {
  id?: string;
  name: string;
  logo_url: string;
  banner_url: string;
  status: string;
  radius: number;
  description: string;
  categories: string[];
  tags: string[];
  is_online: boolean;
  contact: {
    email: string;
    cellphone: string;
    telephone: string;
  };
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    neighborhood: string;
    latitude: number;
    longitude: number;
    number: number;
    complement: string;
    zip_code: string;
  };
  payment_info?: {
    token_id: string;
    webhook: {
      id: string;
      url: string;
      secret: string;
      status: "ACTIVE" | "INACTIVE";
    };
  };
  open_time: Date;
  end_time: Date;
  expo_device_token?: String;
}
