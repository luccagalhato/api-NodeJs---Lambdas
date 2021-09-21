import { EventTypesName, EventTypeStatus } from '../enums';
import { JunoEntity } from './entity';

export interface EventType extends JunoEntity {
  name: EventTypesName;
  label: string;
  status: EventTypeStatus;
}
