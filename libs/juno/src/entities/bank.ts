import { JunoEntity } from './entity';

export interface Bank extends JunoEntity {
  number?: string;
  name?: string;
}