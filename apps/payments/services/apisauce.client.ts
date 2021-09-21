import { CardTokenResponse } from '../../../libs/juno/src/responses';
import apisauce from 'apisauce';
import { Clients } from '../../shared/interfaces/clients.interface';
import { InternalServerErrorException } from '@nestjs/common';

const clientApi = apisauce.create({
  baseURL: process.env.URL_ENDPOINT_CLIENT,
});

const setAuthToken = (accessToken: string, idToken: string) => {
  clientApi.setHeaders({
    authorization: `Bearer ${accessToken}`,
    idtoken: idToken,
  });
};

export const updatePaymentCreditCard = async (
  id: string,
  cardToken: CardTokenResponse,
  accessToken: string,
  idToken: string,
) => {
  setAuthToken(accessToken, idToken);
  try {
    const { data: client } = await clientApi.put<Clients>(
      `/payment/credit-card/${id}`,
      cardToken,
    );

    return client;
  } catch (error) {
    throw new InternalServerErrorException(
      'Erro ao inserir novo cartão de crédito',
    );
  }
};
