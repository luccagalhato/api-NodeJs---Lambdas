import { HttpException } from '@nestjs/common';
import apisauce from 'apisauce';
import { Partners, User } from '../../shared/interfaces';

const partnerApi = apisauce.create({
  baseURL: process.env.URL_ENDPOINT_PARTNER,
});

const setAuthToken = (accessToken: string, idToken: string) => {
  partnerApi.setHeaders({
    authorization: `Bearer ${accessToken}`,
    idtoken: idToken,
  });
};

export const getPartner = async (
  id: string,
  accessToken: string,
  idToken: string,
) => {
  try {
    setAuthToken(accessToken, idToken);
    const resp = await partnerApi.get<Partners>(`/${id}`);
    return resp;
  } catch (error) {
    throw new HttpException(`Partner get failed! ${error}`, error.status);
  }
};

export const createPartner = async (
  user: Partial<User>,
  accessToken: string,
  idToken: string,
) => {
  try {
    setAuthToken(accessToken, idToken);
    const resp = await partnerApi.post<Partners>('/', user);
    return resp;
  } catch (error) {
    console.log(error);
    throw new HttpException(`Partner create failed! ${error}`, error.status);
  }
};
