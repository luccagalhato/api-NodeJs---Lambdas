import { HttpException } from '@nestjs/common';
import apisauce from 'apisauce'
import { Partners } from '../../shared/interfaces';

const partnerApi = apisauce.create({
  baseURL: process.env.URL_ENDPOINT_PARTNER,
})

export const getPartner = async (id: string) => {
  const { ok, data } = await partnerApi.get<Partners>(`/${id}`);

  if (ok) {
    return data
  };

  throw new HttpException('Não existe Partner', 404)
};
