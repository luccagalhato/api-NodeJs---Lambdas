import { HttpException } from '@nestjs/common';
import apisauce from 'apisauce'
import { getAWSSecret } from '../../shared/aws';

const GOOGLE_API_SECRET_ARN = process.env.GOOGLE_API_SECRET_ARN

const autocomplete = 'autocomplete'
const details = 'details'

const collaboratorApi = apisauce.create({
  baseURL: `https://maps.googleapis.com/maps/api/place`,
})

export const getLocation = async (address: string) => {

  const GOOGLE_API_TOKEN: any = await getAWSSecret(GOOGLE_API_SECRET_ARN)
  const jsonApiToken = `json?key=${GOOGLE_API_TOKEN.GoogleMapsAPIToken}`

  const queryParams = {
    libraries: 'geometry',
    componentRestrictions: {country: "br"},
    input: `${address} Brasil`,
    language: 'pt_BR',
  }
  const resp = await collaboratorApi.get<any>(`/${autocomplete}/${jsonApiToken}`, queryParams);

  if (resp.ok) return resp.data.predictions;

  throw new HttpException(resp.originalError, resp.status)
};

export const getFullGoogleAddress = async (place_id: string) => {

  const GOOGLE_API_TOKEN: any = await getAWSSecret(GOOGLE_API_SECRET_ARN)
  const jsonApiToken = `json?key=${GOOGLE_API_TOKEN.GoogleMapsAPIToken}`

  const queryParams = {
    libraries: 'geometry',
    componentRestrictions: {country: "br"},
    place_id,
    language: 'pt_BR',
  }
  const resp = await collaboratorApi.get<any>(`/${details}/${jsonApiToken}`, queryParams);
  if (resp.ok) return resp.data.result;

  throw new HttpException('Error', 500)
}
