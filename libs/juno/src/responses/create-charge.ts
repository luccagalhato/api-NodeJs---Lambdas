import { GetListResponse } from './get-list';
import { Charge } from '../entities';

export type CreateChargesResponse = GetListResponse<{ charges: Charge[] }>;
