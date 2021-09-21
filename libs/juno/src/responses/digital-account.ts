import { JunoEntity } from '../entities/entity';

export type UpdateDigitalAccountResponse = JunoEntity;

export type GetDigitalAccountResponse = JunoEntity;

export interface CreateDigitalAccountResponse extends JunoEntity {
  resourceToken: string;
}
