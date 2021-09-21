import { HttpException } from '@nestjs/common';
import apisauce from 'apisauce'
import { RedisData } from '../../shared/interfaces';

const geolocationApi = apisauce.create({
  baseURL: process.env.URL_ENDPOINT_GEOLOCATION,
})

export const getAllCacheByPrefix = async (prefix) => {
  const { ok, data } = await geolocationApi.get<RedisData[]>(`/all-by-prefix/${prefix}`);

  if (ok) return data;

  throw new HttpException('Não existe Colaborador em cache', 404)
};

export const setCache = async (data) => await geolocationApi.post('/', { data });
