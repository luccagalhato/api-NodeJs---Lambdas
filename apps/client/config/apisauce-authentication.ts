import { HttpException } from '@nestjs/common';
import apisauce from 'apisauce'
import { User } from '../../shared/interfaces';

const authenticationApi = apisauce.create({
  baseURL: process.env.URL_ENDPOINT_AUTHENTICATION,
})

export const createCognitUser = async (user: User) => {
  const { ok, data } = await authenticationApi.post<User>(`/`, user);

  if (ok) return data;

  throw new HttpException('Falha ao salvar cliente', 500)
};

export const authenticateUser = async (user: User) => {
  const { ok, data } = await authenticationApi.post<User>(`/sign-in`, user);

  if (ok) return data;

  throw new HttpException('Falha ao autenticar o cliente', 500)
};
