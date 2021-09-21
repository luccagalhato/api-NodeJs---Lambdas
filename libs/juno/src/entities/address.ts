import { JunoEntity } from './entity';

export interface Address extends JunoEntity {
  city: string;
  complement?: string;
  neighborhood?: string;
  number: string;
  postCode: string;
  state: string;
  street: string;
}
