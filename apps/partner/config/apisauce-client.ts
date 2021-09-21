import { HttpException } from '@nestjs/common';
import apisauce from 'apisauce'
import { Order } from '../../client/src/orders/order';

const clientApi = apisauce.create({
  baseURL: process.env.URL_ENDPOINT_CLIENT,
})

export const getOrder = async (id) => {
  const { ok, data } = await clientApi.get<Order>(`order/${id}`);

  if (ok) return data;

  throw new HttpException('Ordem não encontrada!', 404)
};

export const updateStatusOrder = async (id, status) => {
  const { ok, data } = await clientApi.put<Order>(`order/update-status/${id}`, status);

  if (ok) return data;

  throw new HttpException('Ordem não atualizada!', 404)
};
