import { HttpException } from '@nestjs/common';
import apisauce from 'apisauce'
import { Orders } from '../../shared/interfaces';

const partnerApi = apisauce.create({
  baseURL: process.env.URL_ENDPOINT_PARTNER,
})

export const updateStatusOrder = async (id, status) => {

  const { ok, data } = await partnerApi.put<Orders>(`orders/update-status/${id}`, { status });

  if (ok) return data;

  throw new HttpException('COLLABORATOR APP: Ordem não atualizada', 500)
};
