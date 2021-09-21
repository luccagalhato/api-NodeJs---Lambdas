import { HttpException } from '@nestjs/common';
import apisauce from 'apisauce'
import { Orders } from '../../shared/interfaces';

const clientApi = apisauce.create({
  baseURL: process.env.URL_ENDPOINT_CLIENT
})

export const getOrder = async (id: string) => {

  const { ok, data } = await clientApi.get<Orders>(`/orders/get-one/${id}`);

  if (ok) {
    return data
  };

  throw new HttpException('Não existe Ordem', 404)
};
