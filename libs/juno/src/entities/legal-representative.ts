import { JunoEntity } from './entity';

export interface LegalRepresentative extends JunoEntity {
  birthDate: string;
  document: string;
  name: string;
}