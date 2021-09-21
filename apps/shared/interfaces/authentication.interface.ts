import { AppTypeEnum } from '../enums';

export interface User {
  email: string;
  phone_number?: string;
  password?: string;
  appType?: AppTypeEnum | string;
}

export interface EmailResponse {
  isValidEmail: boolean;
}