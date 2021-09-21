import { GetListResponse } from './get-list';
import { Charge } from '../entities';

export type GetChargesResponse = GetListResponse<{ charges: Charge[] }>;
