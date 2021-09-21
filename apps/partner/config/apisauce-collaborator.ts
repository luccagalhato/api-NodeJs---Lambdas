import { HttpException } from '@nestjs/common';
import apisauce from 'apisauce'
import { DeliveryStatusEnum } from '../../shared/enums';
import { Collaborator } from '../../shared/interfaces';
import { Deliveries } from '../../shared/interfaces/deliveries.interface';

const collaboratorApi = apisauce.create({
  baseURL: process.env.URL_ENDPOINT_COLLABORATOR,
})


export const getClosestCollaborator = async (latitude, longitude) => {
  const { ok, data } = await collaboratorApi.get<Collaborator>(`find-closest-collaborator/${latitude}/${longitude}`);

  if (ok) return data;

  throw new HttpException('Collaborador não encontrado', 500)
};

export const createDelivery = async (delivery: Deliveries) => {
  const { ok, data } = await collaboratorApi.post<Deliveries>(`/deliveries`, delivery);

  if (ok) return data;

  throw new HttpException('Delivery não criada', 404)
};

export const getDelivery = async (id: string) => {
  const { ok, data } = await collaboratorApi.get<Deliveries>(`/deliveries/get-one/${id}`);

  if (ok) return data;

  throw new HttpException('Delivery não encontrado', 404)
};

export const updateDelivery = async (id: string, delivery: Partial<Deliveries>) => {

  const { ok, data } = await collaboratorApi.put<Deliveries>(`/deliveries/update/${id}`, delivery);

  if (ok) return data;

  throw new HttpException('Delivery não atualizado', 404)
};

export const updateStatusDelivery = async (id: string, status: DeliveryStatusEnum) => {

  const { ok, data } = await collaboratorApi.patch<Deliveries>(`/deliveries/change-status/${id}`, status);

  if (ok) return data;

  throw new HttpException('Delivery não atualizado', 404)
};
