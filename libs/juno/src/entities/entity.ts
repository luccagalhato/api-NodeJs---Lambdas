import { Link } from './link';

export interface JunoEntity {
  id?: string;
  _links?: Record<string, Link>[];
}
