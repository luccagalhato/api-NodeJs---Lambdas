import { HttpException } from '@nestjs/common';
import apisauce from 'apisauce';
import { Collaborator, User } from '../../shared/interfaces';

const collaboratorApi = apisauce.create({
  baseURL: process.env.URL_ENDPOINT_COLLABORATOR,
});

const setAuthToken = (accessToken: string, idToken: string) => {
  collaboratorApi.setHeaders({
    authorization: `Bearer ${accessToken}`,
    idtoken: idToken,
  });
};

export const getDeliveryMan = async (
  id: string,
  accessToken: string,
  idToken: string,
) => {
  setAuthToken(accessToken, idToken);
  const response = await collaboratorApi.get<Collaborator>(`/${id}`);

  return response;
};

export const createCollaborator = async (
  collaborator: Partial<User>,
  accessToken: string,
  idToken: string,
) => {
  try {
    setAuthToken(accessToken, idToken);
    const resp = await collaboratorApi.post('/', collaborator);
    return resp;
  } catch (error) {
    console.log(error);
    throw new HttpException(
      `Collaborator create failed! ${error}`,
      error.status,
    );
  }
};
