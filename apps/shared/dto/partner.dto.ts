import { IsNotEmpty } from 'class-validator';
import { Partners } from '../interfaces';

export class PartnerDto implements Partial<Partners> {
  id?: string;
  categories: string[];

  @IsNotEmpty({ message: 'Campo nome é obrigatório' })
  name: string;

  logo_url: string;
  
  banner_url: string;

  status: string;
  description: string;

  radius: number;

  @IsNotEmpty({ message: 'Campo is_online é obrigatório' })
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

  paymentInfo?: {
    token_id: string;
    webhook: {
      id: string;
      url: string;
      secret: string;
      status: 'ACTIVE' | 'INACTIVE';
    };
  };

  open_time: Date;
  end_time: Date;
}
