import { HttpException } from "@nestjs/common";
import apisauce from "apisauce";

import { User } from "../../shared/interfaces";
import { Clients } from "../../shared/interfaces/clients.interface";

const clientApi = apisauce.create({
  baseURL: process.env.URL_ENDPOINT_CLIENT,
});

const setAuthToken = (accessToken: string, idToken: string) => {
  clientApi.setHeaders({
    authorization: `Bearer ${accessToken}`,
    idtoken: idToken,
  });
};

export const getClient = async (
  id: string,
  accessToken: string,
  idToken?: string
) => {
  setAuthToken(accessToken, idToken);
  const resp = await clientApi.get<Clients>(`/${id}`);
  return resp;
};

export const createClient = async (
  user: Partial<User>,
  accessToken: string,
  idToken: string
) => {
  try {
    setAuthToken(accessToken, idToken);
    const resp = await clientApi.post("/create", user);
    console.log(resp);
    return resp;
  } catch (error) {
    console.log(error);
    throw new HttpException(`Client create failed! ${error}`, error.status);
  }
};
